import Navbar from '@/components/navbar/Navbar';
import './globals.css'
import { Inter } from 'next/font/google'
import Footer from '@/components/footer/Footer';
import { ThemeContextProvider } from './context/ThemeContext';
import AuthProvider from './providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blog App',
  description: 'The best blog app!',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeContextProvider>
            <div className='container'>
              <div className='wrapper'>
                <Navbar />
                {children}
                <Footer />
              </div>
            </div>
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
