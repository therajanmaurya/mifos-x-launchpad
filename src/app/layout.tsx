import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MifosLaunchpad - Mifos KMP Project Wizard',
  description: 'Generate white-labeled Mifos Kotlin Multiplatform mobile banking applications with complete CI/CD pipelines',
  keywords: ['Mifos', 'KMP', 'Kotlin Multiplatform', 'Mobile Banking', 'White Label', 'Project Generator'],
  authors: [{ name: 'Mifos Initiative' }],
  openGraph: {
    title: 'MifosLaunchpad - Mifos KMP Project Wizard',
    description: 'Generate white-labeled Mifos mobile banking apps in minutes',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
