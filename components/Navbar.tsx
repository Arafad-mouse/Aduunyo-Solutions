"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"


export default function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav className="flex items-center justify-between px-4 py-2 shadow bg-black">
      <div className="flex items-center space-x-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/4.png"
            alt="Aduunyo Solutions Logo"
            width={240}
            height={65}
            priority
            className="h-12 w-auto"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/" className={`px-4 py-2 transition ${
          pathname === "/" 
            ? "text-blue-400 font-semibold" 
            : "text-white hover:text-gray-300"
        }`}>
          Home
        </Link>
        
        <Link href="/about" className={`px-4 py-2 transition ${
          pathname?.startsWith("/about") 
            ? "text-blue-400 font-semibold" 
            : "text-white hover:text-gray-300"
        }`}>
          About
        </Link>
        
        <Link href="/services" className={`px-4 py-2 transition ${
          pathname?.startsWith("/services") 
            ? "text-blue-400 font-semibold" 
            : "text-white hover:text-gray-300"
        }`}>
          Services
        </Link>
        
        <Link href="/contact" className={`px-4 py-2 transition ${
          pathname === "/contact" 
            ? "text-blue-400 font-semibold" 
            : "text-white hover:text-gray-300"
        }`}>
          Contact
        </Link>
        
        <Link href="/loan" className={`px-4 py-2 transition rounded ${
          pathname === "/loan" 
            ? "bg-blue-500 text-white font-semibold" 
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}>
          Apply Now
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-700 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400 md:hidden"
        aria-expanded="false"
      >
        <span className="sr-only">Open main menu</span>
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </nav>
  )
}
