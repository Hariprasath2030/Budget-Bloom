import { ClerkProvider, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!router.pathname.startsWith('/sign-in') && !router.pathname.startsWith('/sign-up')) {
      // Optional: Use Clerk's RedirectToSignIn or other component to protect routes
    }
  }, [router]);

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
       <ThemeProvider>
      <Component {...pageProps} />
       </ThemeProvider>
    </ClerkProvider>
  );
}

export default MyApp;
