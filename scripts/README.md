# Scripts

## Color Cycler (`color-cycler.js`)

This script automatically applies sequential colors from the sidebar gradient to all `a` tags.

### Usage

```bash
# Run directly
node scripts/color-cycler.js

# Or use npm script
npm run colors
```

### What it does

1. **Extracts colors** from the sidebar gradient background
2. **Applies colors sequentially** to all `a` tags in the document
3. **Generates CSS** for individual link colors
4. **Injects the CSS** into `public/css.css`
5. **Applies 18 colors** from the gradient:
   - Yellow (#fedc00)
   - Orange-yellow (#fcb712)
   - Orange (#f7921e)
   - Dark orange (#e87f24)
   - Red-orange (#dd6227)
   - Red (#dc4c27)
   - Dark red (#ca3435)
   - Burgundy (#b82841)
   - Purple-red (#953751)
   - Blue-purple (#364c88)
   - Blue (#16599d)
   - Dark blue (#02609e)
   - Medium blue (#0073a9)
   - Teal (#008aa4)
   - Green-teal (#239a87)
   - Light green (#7cba6d)
   - Lime green (#becc2f)
   - Bright yellow (#e0d81d)

### Features

- **Sequential color assignment** - each link gets the next color in the palette
- **All links targeted** - applies to every `a` tag in the document
- **Smooth transitions** between colors
- **Hover effects** with subtle scaling
- **Subtle glow animation** for visual interest
- **Safe injection** - won't overwrite existing CSS
- **Re-runnable** - can be executed multiple times

### Output

The script adds CSS that:
- Assigns sequential colors from the sidebar gradient to each link
- Includes smooth transitions and hover effects
- Adds subtle glow animations
- Uses CSS nth-child/nth-of-type selectors for individual styling 