Check responsive design across mobile and tablet breakpoints.

Steps:
1. Ensure dev server is running
2. Use preview MCP tools to resize and screenshot at these widths:
   - Mobile: 375px (iPhone SE)
   - Mobile large: 428px (iPhone 14 Pro Max)
   - Tablet: 768px (iPad)
   - Desktop: 1280px (reference)
3. For each breakpoint, check for:
   - Text overflow or truncation issues
   - Buttons/links too small to tap (min 44px touch target)
   - Horizontal scrolling
   - Navigation usability (hamburger menu, sidebar collapse)
   - Form inputs too narrow
   - Images breaking layout
   - Spacing/padding that looks wrong at that size
4. Report issues grouped by severity (broken → awkward → minor)
5. Suggest specific Tailwind fixes for each issue