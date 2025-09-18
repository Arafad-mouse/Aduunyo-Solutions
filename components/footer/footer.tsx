import React from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-lg font-semibold text-[#8BB42E]">Aduunyo Solutions</h2>
            <p className="mt-4 text-sm">
            Aduunyo Solutions was established in 2024 in response to the growing demand for innovative technology and creative solutions within the local market.<br></br> <br></br>
            
            Many businesses and organizations were seeking reliable partners to support their digital transformation, branding, and communication needs.</p>
            <div className="flex space-x-4 mt-4">
              {/* Placeholder icons */}
              <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">Facebook</span><svg className="h-6 w-6" fill="#8BB42E" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
              <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">WhatsApp</span><svg className="h-6 w-6" fill="#8BB42E" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.06 21.94L7.31 20.58C8.77 21.39 10.37 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM12.04 20.15C10.59 20.15 9.17 19.76 7.91 19.04L7.57 18.83L4.43 19.65L5.28 16.58L5.06 16.24C4.28 14.93 3.82 13.45 3.82 11.91C3.82 7.39 7.51 3.7 12.04 3.7C16.57 3.7 20.26 7.39 20.26 11.92C20.26 16.45 16.57 20.15 12.04 20.15ZM16.56 14.45C16.31 14.32 15.11 13.75 14.87 13.66C14.63 13.57 14.47 13.53 14.31 13.77C14.15 14.01 13.67 14.61 13.51 14.77C13.35 14.93 13.19 14.95 12.95 14.82C12.71 14.7 11.91 14.45 10.93 13.59C10.13 12.91 9.59 12.08 9.43 11.84C9.27 11.6 9.39 11.48 9.51 11.36C9.62 11.25 9.75 11.09 9.88 10.94C10.01 10.79 10.05 10.68 10.13 10.52C10.21 10.36 10.17 10.24 10.11 10.12C10.05 10 9.55 8.79 9.35 8.32C9.15 7.85 8.95 7.91 8.81 7.91C8.67 7.91 8.51 7.91 8.35 7.91C8.19 7.91 7.95 7.97 7.75 8.17C7.55 8.37 7.01 8.86 7.01 9.96C7.01 11.06 7.79 12.1 7.91 12.26C8.03 12.42 9.55 14.83 11.95 15.81C12.57 16.09 13.04 16.26 13.41 16.38C13.97 16.54 14.49 16.5 14.91 16.42C15.39 16.32 16.41 15.75 16.64 15.18C16.87 14.61 16.87 14.13 16.81 14.01C16.75 13.89 16.65 13.83 16.56 14.45Z"/></svg></a>
              <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">Instagram</span><svg className="h-6 w-6" fill="#8BB42E" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#8BB42E]">Quick links</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/" className="text-base text-gray-500 hover:text-gray-900">Home</Link></li>
              <li><Link href="/#about-us" className="text-base text-gray-500 hover:text-gray-900">About</Link></li>
              <li><Link href="/loan-application" className="text-base text-gray-500 hover:text-gray-900">Apply Now</Link></li>
              <li><Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">Contacts</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#8BB42E] tracking-wider uppercase">Subscribe to Our Newsletter</h3>
            <p className="mt-4 text-sm text-gray-500">Subscribe and stay up to date with our news and upcoming events.</p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <Input type="email" placeholder="Enter Email" className="w-full" />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <Button type="submit" className="bg-[#8BB42E] hover:bg-[#8BB42E]/80">Send</Button>
              </div>
            </form>
            <div className="mt-6">
                <h4 className="text-sm font-semibold text-[#8BB42E]">Chat With Us</h4>
                <p className="text-sm text-gray-500">Connect with us on Whatsapp</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#8BB42E] tracking-wider uppercase">Contacts us </h3>
            <div className="mt-4 space-y-4">
                <p className="text-gray-600">Call Us<br/>Telephone: +252 63 00000000, +252 65 0000000</p>
                <p className="text-gray-600">Mail Us<br/>info@Aduunyo-solutions.com, support@Aduunyo-solutions.com</p>
                <p className="text-gray-600">Visit Us<br/>Road No. 123, Hargeisa, Somaliland</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex justify-between items-center">
          <p className="text-base text-gray-400 xl:text-center">© 2024 Aduunyo Solutions.      Developed by <a href="https://generexco.com" className="text-[#8BB42E] hover:underline">Generex Communication</a></p>
          <div className="flex items-center">
            <p>2025 Version </p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
