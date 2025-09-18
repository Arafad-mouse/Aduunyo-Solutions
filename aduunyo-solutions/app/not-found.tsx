import Link from 'next/link'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
          <h1 className="text-6xl font-bold text-gray-800">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
          <p className="text-gray-500 mt-2">Sorry, the page you are looking for does not exist.</p>
          <Link href="/" className="mt-6 px-4 py-2 bg-[#8BB42E] text-white rounded-md hover:bg-[#8BB42E]/90 transition-colors">
            Go back home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
