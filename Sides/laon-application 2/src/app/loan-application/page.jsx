import LoanApplicationPage from './LoanApplicationPage';

export const metadata = {
  title: 'Loan Application Form - Complete Your Application',
  description: 'Apply for a loan with our comprehensive application form. Provide personal information, employment details, and upload required documents for quick approval and competitive rates.',
  keywords: 'loan application form, personal loan, business loan, employment verification, income details, document upload, financial application, loan approval',
  
  openGraph: {
    title: 'Loan Application Form - Complete Your Application',
    description: 'Apply for a loan with our comprehensive application form. Provide personal information, employment details, and upload required documents for quick approval and competitive rates.',
  }
}

export default function Page() {
  return <LoanApplicationPage />
}