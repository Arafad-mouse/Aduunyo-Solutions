# Aduunyo Solutions Navbar Components

This directory contains both HTML/CSS/JS and React/Next.js implementations of the Aduunyo Solutions navbar.

## Files Overview

### HTML/CSS/JS Version
- `index.html` - Main HTML file with responsive navbar
- `style.css` - Complete styling with white background and responsive design
- `script.js` - JavaScript for mobile menu functionality

### React/Next.js Version
- `navbar-component.tsx` - Basic React navbar using shadcn/ui NavigationMenu
- `mobile-navbar.tsx` - Full responsive React navbar with mobile sheet menu

## Features

### Both Versions Include:
- ✅ White background design
- ✅ Logo on the left side
- ✅ Navigation links: Home, About, Services, Contact
- ✅ Responsive mobile design
- ✅ Hover effects and smooth transitions
- ✅ Modern, clean styling

### React Version Additional Features:
- ✅ Dropdown menus for About and Services
- ✅ Mobile sheet menu with proper categorization
- ✅ Apply Now CTA button
- ✅ TypeScript support
- ✅ shadcn/ui components integration

## Usage

### HTML Version
Simply open `index.html` in a browser or serve it with a local server:
```bash
python -m http.server 8000
```

### React Version
Import the component in your Next.js app:

```tsx
import { ResponsiveNavbar } from './components/navbar/mobile-navbar'

export default function Layout({ children }) {
  return (
    <>
      <ResponsiveNavbar />
      <main>{children}</main>
    </>
  )
}
```

## Dependencies for React Version

Make sure you have these shadcn/ui components installed:
- NavigationMenu
- Button
- Sheet
- lucide-react icons

## Customization

### Colors
The navbar uses a white background with dark text for optimal contrast. Hover effects use a subtle blue accent color (#667eea).

### Mobile Breakpoints
- Desktop: 1024px and above
- Tablet: 768px - 1023px  
- Mobile: Below 768px

### Logo
Update the logo path in both versions:
- HTML: Change `src="image-20.png"` in the img tag
- React: Update the `src="/image-20.png"` in the Image component

## Integration Notes

The React components are designed to work with:
- Next.js 13+ with App Router
- Tailwind CSS
- shadcn/ui component library
- TypeScript

For the HTML version, all files are self-contained and work without additional dependencies.
