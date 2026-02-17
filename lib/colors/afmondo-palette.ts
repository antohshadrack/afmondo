/**
 * Afmondo Brand Color Palette
 * Extracted from Afmondo Commerce & Transport Finland logo
 */

export const AfmondoPalette = {
  // Primary Colors
  primary: {
    green: '#1BA632', // Primary green - used in "mondo" and globe
    orange: '#F5A623', // Primary orange - used in "Af", ship, and plane
  },

  // Secondary Colors
  secondary: {
    darkGreen: '#0D7A1F', // Darker green accent
    lightOrange: '#FFC107', // Lighter orange accent
    gray: '#CCCCCC', // Gray used in globe land/sea distinction
    lightGray: '#E8E8E8', // Light gray for backgrounds
  },

  // Extended Palette
  extended: {
    emerald: '#1BA632',
    amber: '#F5A623',
    slate: '#CCCCCC',
    white: '#FFFFFF',
    darkCharcoal: '#000000', // For text and shadows
  },

  // Tailwind CSS Compatible Classes
  tailwindMap: {
    'bg-afmondo-green': 'bg-[#1BA632]',
    'bg-afmondo-orange': 'bg-[#F5A623]',
    'text-afmondo-green': 'text-[#1BA632]',
    'text-afmondo-orange': 'text-[#F5A623]',
    'border-afmondo-green': 'border-[#1BA632]',
    'border-afmondo-orange': 'border-[#F5A623]',
  },
};

// RGB Values for reference
export const AfmondoRGB = {
  green: 'rgb(27, 166, 50)', // #1BA632
  orange: 'rgb(245, 166, 35)', // #F5A623
  gray: 'rgb(204, 204, 204)', // #CCCCCC
  lightGray: 'rgb(232, 232, 232)', // #E8E8E8
};

// HSL Values for reference
export const AfmondoHSL = {
  green: 'hsl(125, 72%, 54%)', // #1BA632
  orange: 'hsl(39, 90%, 55%)', // #F5A623
  gray: 'hsl(0, 0%, 80%)', // #CCCCCC
  lightGray: 'hsl(0, 0%, 91%)', // #E8E8E8
};

export default AfmondoPalette;
