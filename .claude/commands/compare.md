Take before/after screenshots to compare visual changes.

Usage: The user should run this BEFORE making changes to capture the "before" state. Then after changes are applied, run it again to capture "after."

Steps:
1. Ensure dev server is running
2. Check if a "before" screenshot was already captured this session
   - If NO: Take the current screenshot, save a mental note that this is the "before" state. Tell the user: "Before state captured. Make your changes and run /compare again to see the diff."
   - If YES: Take the "after" screenshot. Show both screenshots to the user and describe:
     - What changed visually
     - Whether the changes improved warmth, premium feel, and clarity
     - Any regressions introduced
     - Reset the before/after state for the next comparison

If the user specifies a page URL, navigate there. Otherwise use the current page.