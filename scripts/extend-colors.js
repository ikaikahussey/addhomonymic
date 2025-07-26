#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

// Function to interpolate between two colors
function interpolateColor(color1, color2, factor) {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Function to generate more colors by interpolating
function generateExtendedColors() {
  const originalColors = [
    '#fedc00', '#fcb712', '#f7921e', '#e87f24', '#dd6227',
    '#dc4c27', '#ca3435', '#b82841', '#953751', '#364c88',
    '#16599d', '#02609e', '#0073a9', '#008aa4', '#239a87',
    '#7cba6d', '#becc2f', '#e0d81d'
  ];
  
  const extended = [...originalColors];
  
  // Add interpolated colors between existing ones
  for (let i = 0; i < originalColors.length - 1; i++) {
    const color1 = originalColors[i];
    const color2 = originalColors[i + 1];
    
    // Add 2 interpolated colors between each pair
    for (let j = 1; j <= 2; j++) {
      const factor = j / 3;
      const interpolatedColor = interpolateColor(color1, color2, factor);
      extended.push(interpolatedColor);
    }
  }
  
  return extended;
}

// Function to generate CSS with extended color variables
function generateExtendedCSS() {
  const colors = generateExtendedColors();
  
  let css = '/* Auto-generated extended background colors for all links within .posts */\n';
  css += '/* Extended colors from sidebar gradient - applied to all post links */\n\n';
  
  // Define CSS custom properties for each color
  css += ':root {\n';
  colors.forEach((color, index) => {
    css += `  --link-bg-color-${index + 1}: ${color};\n`;
  });
  css += '}\n\n';
  
  // Generate CSS rules for each color
  colors.forEach((color, index) => {
    const colorIndex = index + 1;
    css += `.posts article:nth-of-type(${colorIndex}) a {\n`;
    css += `  background-color: var(--link-bg-color-${colorIndex});\n`;
    css += `  color: #000000; /* Will be overridden by contrast calculator */\n`;
    css += `  padding: 2px 4px;\n`;
    css += `  border-radius: 3px;\n`;
    css += `  text-decoration: none;\n`;
    css += `  transition: background-color 0.3s ease, opacity 0.3s ease;\n`;
    css += `}\n\n`;
  });
  
  // Add hover effects
  css += '/* Hover effects for all links in .posts */\n';
  css += '.posts a:hover {\n';
  css += '  opacity: 0.8 !important;\n';
  css += '  text-decoration: none !important;\n';
  css += '  transform: scale(1.02);\n';
  css += '}\n\n';
  
  // Add subtle animation
  css += '@keyframes subtleGlow {\n';
  css += '  0% { filter: brightness(1); }\n';
  css += '  50% { filter: brightness(1.1); }\n';
  css += '  100% { filter: brightness(1); }\n';
  css += '}\n\n';
  
  css += '.posts a {\n';
  css += '  animation: subtleGlow 3s ease-in-out infinite;\n';
  css += '  animation-delay: calc(var(--link-index, 0) * 0.2s);\n';
  css += '}\n';
  
  return css;
}

// Function to inject extended CSS into the public CSS file
function injectExtendedCSS() {
  const cssPath = path.join(__dirname, '../public/css.css');
  const extendedCSS = generateExtendedCSS();
  
  try {
    // Read existing CSS
    let existingCSS = fs.readFileSync(cssPath, 'utf8');
    
    // Remove any existing color cycling CSS
    const lines = existingCSS.split('\n');
    const filteredLines = [];
    let inColorSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip lines that are part of color cycling sections
      if (line.includes('/* Auto-generated background colors for all links within .posts */') ||
          line.includes('/* Auto-generated extended background colors for all links within .posts */') ||
          line.includes('/* Colors from sidebar gradient - applied to all post links */') ||
          line.includes('/* Extended colors from sidebar gradient - applied to all post links */')) {
        inColorSection = true;
        continue;
      }
      if (inColorSection && line.includes('/* End auto-generated color cycling */')) {
        inColorSection = false;
        continue;
      }
      
      if (!inColorSection) {
        filteredLines.push(line);
      }
    }
    
    // Add the new extended color cycling CSS
    const updatedCSS = filteredLines.join('\n') + '\n\n' + extendedCSS + '\n/* End auto-generated color cycling */\n';
    
    // Write back to file
    fs.writeFileSync(cssPath, updatedCSS);
    
    const colors = generateExtendedColors();
    console.log('✅ Extended color CSS injected successfully!');
    console.log(`🎨 Applied ${colors.length} background colors from the extended gradient`);
    console.log('🔗 Targeting all links within .posts div with extended background colors');
    console.log('📁 Updated public/css.css directly');
    
  } catch (error) {
    console.error('❌ Error injecting extended CSS:', error.message);
    console.error('💡 Make sure the development server is running and public/css.css exists');
  }
}

// Function to create a color preview
function createColorPreview() {
  const colors = generateExtendedColors();
  console.log('\n🎨 Extended Color Palette:');
  colors.forEach((color, index) => {
    console.log(`${index + 1}. ${color}`);
  });
}

// Main execution
if (require.main === module) {
  console.log('🎨 Extending color palette beyond 18 colors...\n');
  
  createColorPreview();
  injectExtendedCSS();
  
  console.log('\n✨ Done! Extended color palette applied.');
  console.log('🔗 Now targeting all links within the .posts div with extended colors.');
  console.log('🌐 Check your browser at http://localhost:8080 to see the changes!');
} 