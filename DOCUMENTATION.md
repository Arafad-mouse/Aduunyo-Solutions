# Aduunyo Solutions - Project Documentation

## Project Overview
This documentation provides a comprehensive overview of the Aduunyo Solutions project structure, including all directories and their purposes.

## Root Directory Structure

### 1. `/About/`
Contains the 'About Us' section of the website.
- `src/` - Source files for the About page
- `AboutUs.html` - Main About Us HTML page

### 2. `/aduunyo-solutions/`
Main Next.js application directory for the Aduunyo Solutions website.
- `.env.local` - Environment variables (not tracked in version control)
- `.gitignore` - Git ignore rules
- `components/` - Reusable React components
  - `ui/` - shadcn/ui components
    - `navigation-menu.tsx` - Navigation menu component
- `app/` - Next.js app directory
  - `page.tsx` - Main page component
  - `layout.tsx` - Root layout component
  - `globals.css` - Global styles
- `public/` - Static assets
- `styles/` - Global CSS files
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts

### 3. `/Footer/`
Contains footer component files.
- `Footer.html` - Footer HTML structure
- `style.css` - Footer styles
- `assets/` - Footer related assets

### 4. `/landing page/`
Main landing page files.
- `Landing.html` - Main landing page
- `src/` - Source files
  - `Images 2/` - Image assets
  - `Styling 2/` - CSS files
  - `images/` - Additional images
- `index.html` - Alternative index file
- `style.css` - Landing page styles

### 5. `/Navbar/`
Contains navigation bar implementations.
- `Navbar.html` - HTML implementation
- `Navbar.png` - Navbar design reference
- `Navbar.zip` - Compressed navbar files
- `mobile-navbar.tsx` - Responsive React navbar component
- `navbar-component.tsx` - Main navbar React component
- `script.js` - JavaScript functionality
- `style.css` - Navbar styles
- `README.md` - Documentation

### 6. Root Files
- `Application Form.png` - Application form design
- `Supabase client.ts` - Supabase client configuration
- `footer.png` - Footer design reference
- `image-20.png` - Logo/icon asset
- `index.html` - Main HTML entry point
- `style.css` - Global styles
- `vars.css` - CSS variables definition

## Development Setup

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later
- Git

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Production Build
```bash
npm run build
npm start
```

## Dependencies
- Next.js 13+
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Supabase (for backend services)

## Project Structure Conventions
- Components are stored in the `components/` directory
- Pages are in the `app/` directory (Next.js 13+ App Router)
- Styles use Tailwind CSS with custom configurations
- Static assets are stored in the `public/` directory

## Contributing
1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License
[Specify License]
