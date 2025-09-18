import { Metadata } from 'next';
import '@/app/globals.css';
import '@/app/landing.css';
import '@/app/styles/landing.css';

// Import the client component
import HomeClient from '../components/home/home-client';

export const metadata: Metadata = {
  title: "Aduunyo — Financial Freedom",
  description: "Get your first loan at 0% upfront cost. Access essential electronics with flexible payment plans.",
  keywords: ["loan", "financing", "electronics", "0% interest", "Somalia"],
};

export default function HomePage() {
  return <HomeClient />;
}
