#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

// Import our custom contrast calculator plugin
const contrastCalculator = require('./contrast-calculator.js');

async function processCSS() {
  const cssPath = path.join(__dirname, '../public/css.css');
  
  try {
    // Read the CSS file
    const css = fs.readFileSync(cssPath, 'utf8');
    
    // Process with PostCSS
    const result = await postcss([
      autoprefixer,
      contrastCalculator
    ]).process(css, { from: cssPath, to: cssPath });
    
    // Write the processed CSS back
    fs.writeFileSync(cssPath, result.css);
    
    console.log('✅ CSS processed with automatic contrast calculation!');
    console.log('🎨 Text colors automatically optimized for each background color');
    console.log('📁 Updated public/css.css with optimal contrast ratios');
    
  } catch (error) {
    console.error('❌ Error processing CSS:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  processCSS();
}

module.exports = { processCSS }; 