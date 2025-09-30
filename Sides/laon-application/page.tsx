import { redirect } from 'next/navigation';

export default function LoanAppRedirect() {
  // Redirect to the loan application running on a different port (e.g., 3001)
  redirect('http://localhost:3012/loan-application');
  
  return null;
}
