/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#9B26B6",
          "secondary": "#FFA400",  
          "accent": "#1FB2A5",    
          "neutral": "#191D24",
          "base-100": "#2A303C",
          "info": "#3ABFF8",  
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      }
    ]
  }
}

