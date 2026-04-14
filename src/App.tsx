import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";

// React 19 compatibility: Temporarily disable HelmetProvider
// react-helmet-async@2.0.5 doesn't support React 19
// This is a no-op wrapper that doesn't break the app
const HelmetProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Lazy load pages for code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Events = lazy(() => import("@/pages/Events"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const FIC = lazy(() => import("@/pages/FIC"));
const Register = lazy(() => import("@/pages/Register"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Profile = lazy(() => import("@/pages/Profile"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminEventManagePage = lazy(() => import("@/pages/AdminEventManagePage"));
const StartupWorldCup = lazy(() => import("@/pages/StartupWorldCup"));
const AskUs = lazy(() => import("@/pages/AskUs"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

// Dashboard redirect component - redirects to profile page
function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user?.profile_slug) {
      setLocation(`/member/${user.profile_slug}`);
    }
  }, [user?.profile_slug, isLoading, setLocation]);

  return <PageLoader />;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/events" component={Events} />
        <Route path="/events/:id" component={EventDetail} />
        <Route path="/fic" component={FIC} />
        <Route path="/member/:slug" component={Profile} />
        <Route path="/startup-world-cup" component={StartupWorldCup} />
        <Route path="/askus" component={AskUs} />

        {/* Auth Routes */}
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />

        {/* Protected Routes - Dashboard redirects to profile */}
        <Route path="/dashboard" component={() => (
          <AuthGuard>
            <DashboardRedirect />
          </AuthGuard>
        )} />

        {/* Admin Routes */}
        <Route path="/admin/events/:id" component={() => (
          <AuthGuard requireAdmin>
            <Suspense fallback={<PageLoader />}>
              <AdminEventManagePage />
            </Suspense>
          </AuthGuard>
        )} />
        <Route path="/admin" component={() => (
          <AuthGuard requireAdmin>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </AuthGuard>
        )} />

        {/* 404 Route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
