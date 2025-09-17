import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your loan application. We've received your information and our team will 
          review it shortly. You'll receive a confirmation email with further details.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link href="/">Back to Home</Link>
          </Button>
          <div className="text-sm text-gray-500">
            Application ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
