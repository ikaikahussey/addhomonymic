const postcss = require('postcss');

// Function to calculate relative luminance of a color
function getLuminance(hex) {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  // Apply gamma correction
  const rGamma = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gGamma = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bGamma = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rGamma + 0.7152 * gGamma + 0.0722 * bGamma;
}

// Function to determine optimal text color based on background
function getOptimalTextColor(backgroundColor) {
  const luminance = getLuminance(backgroundColor);
  
  // Use black text on light backgrounds, white text on dark backgrounds
  // Threshold of 0.5 provides good contrast
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Extended color palette - original 18 plus additional interpolated colors
const extendedColors = [
  // Original 18 colors
  '#fedc00', '#fcb712', '#f7921e', '#e87f24', '#dd6227',
  '#dc4c27', '#ca3435', '#b82841', '#953751', '#364c88',
  '#16599d', '#02609e', '#0073a9', '#008aa4', '#239a87',
  '#7cba6d', '#becc2f', '#e0d81d',
  
  // Additional interpolated colors (19-36)
  '#f4e600', '#f0d800', '#ecca00', '#e8bc00', '#e4ae00',
  '#e0a000', '#dc9200', '#d88400', '#d47600', '#d06800',
  '#cc5a00', '#c84c00', '#c43e00', '#c03000', '#bc2200',
  '#b81400', '#b40600', '#b00000'
];

// PostCSS plugin
module.exports = postcss.plugin('contrast-calculator', () => {
  return (css) => {
    css.walkDecls('background-color', (decl) => {
      const rule = decl.parent;
      const bgColor = decl.value;
      
      // Only process if it's a CSS custom property or hex color
      if (bgColor.includes('var(--link-bg-color-') || bgColor.match(/#[0-9a-fA-F]{6}/)) {
        // Find or create color declaration
        let colorDecl = rule.nodes.find(node => node.prop === 'color');
        
        if (!colorDecl) {
          colorDecl = postcss.decl({ prop: 'color', value: '#000000' });
          rule.append(colorDecl);
        }
        
        // If it's a CSS custom property, we need to calculate for each color
        if (bgColor.includes('var(--link-bg-color-')) {
          // Extract the color number
          const match = bgColor.match(/var\(--link-bg-color-(\d+)\)/);
          if (match) {
            const colorIndex = parseInt(match[1]);
            
            if (extendedColors[colorIndex - 1]) {
              const optimalColor = getOptimalTextColor(extendedColors[colorIndex - 1]);
              colorDecl.value = optimalColor;
            }
          }
        } else if (bgColor.match(/#[0-9a-fA-F]{6}/)) {
          // Direct hex color
          const optimalColor = getOptimalTextColor(bgColor);
          colorDecl.value = optimalColor;
        }
      }
    });
  };
}); 