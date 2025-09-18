"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const services = [
  {
    title: "Electronics Financing",
    href: "/services/electronics",
    description: "Get the latest electronics with flexible payment plans and 0% upfront cost on your first loan.",
  },
  {
    title: "Home Appliances",
    href: "/services/appliances",
    description: "Upgrade your home with essential appliances through our affordable financing options.",
  },
  {
    title: "Business Equipment",
    href: "/services/business",
    description: "Grow your business with laptops, phones, and other essential equipment.",
  },
  {
    title: "Personal Loans",
    href: "/services/personal",
    description: "Quick and easy personal loans for your immediate financial needs.",
  },
]

const aboutLinks = [
  {
    title: "Our Story",
    href: "/about/story",
    description: "Learn about our mission to provide financial freedom without barriers.",
  },
  {
    title: "How It Works",
    href: "/about/process",
    description: "Understand our simple and transparent loan application process.",
  },
  {
    title: "Terms & Conditions",
    href: "/about/terms",
    description: "Read our terms and conditions for complete transparency.",
  },
]

export function AduunyoNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-20 items-center justify-between px-4">
        {/* Logo */}
                <Link href="/" className="flex items-center">
          <Image
            src="/4.png"
            alt="Aduunyo Solutions Logo"
            width={203}
            height={55}
            priority
            className="h-14 w-auto"
          />
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className={`${navigationMenuTriggerStyle()} text-muted-foreground`}>
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-muted-foreground">About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/about"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Aduunyo Solutions
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Your first loan at 0% upfront cost. Financial empowerment without barriers.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {aboutLinks.map((link) => (
                    <ListItem
                      key={link.title}
                      title={link.title}
                      href={link.href}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-muted-foreground">Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {services.map((service) => (
                    <ListItem
                      key={service.title}
                      title={service.title}
                      href={service.href}
                    >
                      {service.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact" className={`${navigationMenuTriggerStyle()} text-muted-foreground`}>
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/loan-application" className={`${navigationMenuTriggerStyle()} bg-primary text-primary-foreground hover:bg-primary/90`}>
                  Apply Now
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
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
      </div>
    </nav>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
