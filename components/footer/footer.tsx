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
            <h2 className="text-lg font-semibold text-[#5ba44c]">Aduunyo Solutions</h2>
            <p className="mt-4 text-sm" style={{ textAlign: 'justify' , fontSize: '16px'}} >
            Aduunyo Solutions was established in 2024 in response to the growing demand for innovative technology and creative solutions within the local market.<br></br> <br></br>
            
            Many businesses and organizations were seeking reliable partners to support their digital transformation, branding, and communication needs.</p>
            <div className="flex space-x-4 mt-4">
              {/* Facebook */}
              <a href="#" className="text-[#8BB42E] hover:text-[#5ba44c] transition-colors duration-200" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>

              {/* Instagram */}
              <a href="#" className="text-[#8BB42E] hover:text-[#5ba44c] transition-colors duration-200" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.75 2h8.5C19.097 2 22 4.903 22 8.25v7.5C22 19.097 19.097 22 16.25 22h-8.5C4.903 22 2 19.097 2 16.25v-7.5C2 4.903 4.903 2 7.75 2zm0 2C5.679 4 4 5.679 4 7.75v8.5C4 18.321 5.679 20 7.75 20h8.5c2.071 0 3.75-1.679 3.75-3.75v-8.5C20 5.679 18.321 4 16.25 4h-8.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a href="#" className="text-[#8BB42E] hover:text-[#5ba44c] transition-colors duration-200" aria-label="WhatsApp">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.52 3.48A11.88 11.88 0 0012 0C5.373 0 0 5.373 0 12c0 2.12.555 4.098 1.607 5.835L0 24l6.417-1.607A11.916 11.916 0 0012 24c6.627 0 12-5.373 12-12 0-3.187-1.242-6.21-3.48-8.52zm-8.52 16c-1.907 0-3.788-.523-5.396-1.51l-.386-.23-3.812.956.957-3.812-.23-.386A9.958 9.958 0 012 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10zm5.42-7.36c-.077-.128-.281-.204-.588-.357-.307-.153-1.812-.895-2.092-.996-.281-.102-.486-.153-.691.153s-.792.996-.97 1.2c-.179.204-.358.23-.665.077-.307-.153-1.295-.477-2.466-1.522-.912-.812-1.527-1.812-1.708-2.119-.179-.307-.019-.473.134-.625.138-.138.307-.358.461-.537.153-.179.204-.307.307-.512.102-.204.051-.384-.025-.537-.077-.153-.691-1.664-.947-2.278-.25-.598-.505-.516-.691-.526-.179-.008-.384-.01-.588-.01s-.537.077-.82.384c-.281.307-1.075 1.047-1.075 2.552s1.1 2.958 1.254 3.164c.153.204 2.164 3.293 5.23 4.615.731.315 1.3.503 1.743.644.732.23 1.398.197 1.925.12.586-.084 1.812-.741 2.069-1.457.256-.716.256-1.331.179-1.457z" />
                </svg>
              </a>

              {/* TikTok */}
              <a href="#" className="text-[#8BB42E] hover:text-[#5ba44c] transition-colors duration-200" aria-label="TikTok">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.2 8.2 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.26z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#5ba44c]">Quick links</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/" className="text-base text-gray-500 hover:text-gray-900">Home</Link></li>
              <li><Link href="/#about-us" className="text-base text-gray-500 hover:text-gray-900">About</Link></li>
              <li><Link href="/services" className="text-base text-gray-500 hover:text-gray-900">Our Partners & Clients</Link></li>
              <li><Link href="/our-product" className="text-base text-gray-500 hover:text-gray-900">Our Products</Link></li>
              <li><Link href="/loan-application" className="text-base text-gray-500 hover:text-gray-900">Apply Now</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#5ba44c] tracking-wider uppercase text-bold">Subscribe to Our Newsletter</h2>
            <p className="mt-4 text-sm text-gray-500">Subscribe and stay up to date with our news and upcoming events.</p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <Input type="email" placeholder="Enter Email" className="w-full" />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <Button type="submit" className="bg-[#5ba44c] hover:bg-[#5ba44c]/80">Send</Button>
              </div>
            </form>
            <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#5ba44c]">Chat With Us</h3>
                <p className="text-sm text-gray-500">Connect with us on Whatsapp</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#5ba44c] tracking-wider uppercase text-bold" >Contacts us </h2>
            <div className="mt-4 space-y-4">
                <p className="text-gray-600" style={{ fontSize: '16px'}}>Call Us On <br/>+252 63 9119000 , <br></br>+252 65 9119000</p>
                <p className="text-gray-600" style={{ fontSize: '16px' }}>Mail Us<br/>info@Aduunyo-solutions.com support@Aduunyo-solutions.com</p>
                <p className="text-gray-600" style={{ fontSize: '16px' }}>Visit Us<br/>Road Number 01,Kheyriyada Area, Hargeisa, Somaliland</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex justify-between items-center">
          <p className="text-base text-gray-400 xl:text-center">© 2024 Aduunyo Solutions.      Developed by <a href="https://generexco.com" className="text-[#5ba44c] hover:underline">Generex Communication</a></p>
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
