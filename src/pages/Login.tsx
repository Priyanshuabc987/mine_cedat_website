import { LoginForm } from '@/components/auth/LoginForm';
import { Footer } from '@/components/layout/Footer';
import { generateSEO, seoConfigs } from '@/lib/seo';

export default function Login() {
  return (
    <>
      {generateSEO(seoConfigs.login)}
      <LoginForm />
      <Footer />
    </>
  );
}
