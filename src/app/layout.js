import Navbar from '@/components/navbar/Navbar';
import './globals.css'
import { JetBrains_Mono } from 'next/font/google'
import Footer from '@/components/footer/Footer';
import { ThemeContextProvider } from './context/ThemeContext';
import AuthProvider from './providers/AuthProvider';

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata = {
  title: 'Zarif — Frontend systems, made understandable',
  description: 'Notes on building frontend systems that stay understandable as products grow.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={mono.variable}>
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
