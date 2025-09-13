import '../styles/index.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: {
    default: 'LoanEase Application Portal',
    template: 'LoanEase Application Portal | %s',
  },
  description: 'Streamline your loan application process with our comprehensive multi-step form. Apply for personal loans, business loans, and more with secure document upload and instant verification.',
  keywords: 'loan application, personal loans, business loans, online lending, financial services, loan approval',
  
  openGraph: {
    type: 'website',
    title: {
      default: 'LoanEase Application Portal',
      template: 'LoanEase Application Portal | %s',
    },
    description: 'Apply for loans quickly and securely with our user-friendly application portal. Get instant approval and competitive rates for all your financial needs.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        <script type="module" src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Farafadsa2464back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.8"></script>
      </body>
    </html>
  );
}