Scan a page for UX rough edges and fix them. If a specific page is mentioned, check that page. Otherwise, ask which page.

Check for these categories:

**Completeness:**
- Placeholder text left behind ("Lorem ipsum", "TODO", "Coming soon")
- Missing empty states (what shows when there's no data?)
- Missing loading states (skeleton loaders, spinners)
- Broken or missing images

**Interaction:**
- Buttons without hover/active states
- Missing focus indicators for keyboard navigation
- Forms without validation feedback
- No confirmation for destructive actions (delete, cancel)
- Missing success/error toast notifications after actions

**Visual polish:**
- Inconsistent spacing or alignment
- Elements not vertically centered when they should be
- Awkward line lengths (too wide or too narrow)
- Missing transitions/animations on state changes
- Harsh borders that could be softer shadows

**Accessibility:**
- Images without alt text
- Low contrast text
- Missing form labels
- Interactive elements without aria labels

For each issue found, fix it directly (don't just report). Show what was changed.