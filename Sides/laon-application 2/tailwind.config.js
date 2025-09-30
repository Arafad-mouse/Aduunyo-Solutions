module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: ["class", "class"],
  theme: {
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px',
  		'2xl': '1536px'
  	},
  	extend: {
  		colors: {
  			primary: {
  				background: 'var(--primary-background)',
  				foreground: 'hsl(var(--primary-foreground))',
  				light: 'var(--primary-light)',
  				dark: 'var(--primary-dark)',
  				DEFAULT: 'hsl(var(--primary))'
  			},
  			secondary: {
  				background: 'var(--secondary-background)',
  				foreground: 'hsl(var(--secondary-foreground))',
  				light: 'var(--secondary-light)',
  				dark: 'var(--secondary-dark)',
  				DEFAULT: 'hsl(var(--secondary))'
  			},
  			text: {
  				primary: 'var(--text-primary)',
  				secondary: 'var(--text-secondary)',
  				muted: 'var(--text-muted)',
  				accent: 'var(--text-accent)',
  				tertiary: 'var(--text-tertiary)',
  				light: 'var(--text-light)'
  			},
  			background: 'hsl(var(--background))',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			button: {
  				primary: {
  					background: 'var(--button-primary-bg)',
  					text: 'var(--button-primary-text)'
  				},
  				secondary: {
  					background: 'var(--button-secondary-bg)',
  					text: 'var(--button-secondary-text)'
  				},
  				border: 'var(--button-border)'
  			},
  			checkbox: {
  				text: 'var(--checkbox-text)'
  			},
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontSize: {
  			sm: 'var(--font-size-sm)',
  			base: 'var(--font-size-base)',
  			lg: 'var(--font-size-lg)'
  		},
  		fontWeight: {
  			normal: 'var(--font-weight-normal)',
  			medium: 'var(--font-weight-medium)',
  			semibold: 'var(--font-weight-semibold)'
  		},
  		lineHeight: {
  			sm: 'var(--line-height-sm)',
  			base: 'var(--line-height-base)',
  			lg: 'var(--line-height-lg)'
  		},
  		spacing: {
  			xs: 'var(--spacing-xs)',
  			sm: 'var(--spacing-sm)',
  			md: 'var(--spacing-md)',
  			lg: 'var(--spacing-lg)',
  			xl: 'var(--spacing-xl)',
  			'2xl': 'var(--spacing-2xl)',
  			'3xl': 'var(--spacing-3xl)',
  			'4xl': 'var(--spacing-4xl)'
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
};