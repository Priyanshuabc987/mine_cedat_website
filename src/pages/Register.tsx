import { RegisterForm } from '@/components/auth/RegisterForm';
import { Footer } from '@/components/layout/Footer';
import { generateSEO, seoConfigs } from '@/lib/seo';

export default function Register() {
  return (
    <>
      {generateSEO(seoConfigs.register)}
      <RegisterForm />
      <Footer />
    </>
  );
}
