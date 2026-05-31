# Bug Report

## Known Issues

### 1. Contact Form Backend Missing
- **Status:** Open
- **Severity:** Medium
- **Description:** The `Contact.tsx` form currently executes a visual simulation of sending a message using `setTimeout` and updates the UI state to "Success". No actual email or payload is transmitted.
- **Fix Required:** Connect the `handleSubmit` function to a valid endpoint.

### 2. Mobile Safari Viewport Heights
- **Status:** Monitor
- **Severity:** Low
- **Description:** Sections using `min-h-screen` can sometimes behave unpredictably on Mobile Safari due to the dynamic address bar.
- **Fix Required:** Switch `min-h-screen` to `min-h-[100dvh]` where absolute full-screen coverage is strictly required (e.g., the initial Hero viewport).

### 3. Custom Cursor on Touch Devices
- **Status:** Monitor
- **Severity:** Low
- **Description:** The global custom cursor (`CustomCursor.tsx`) might still render or interfere on devices that support both touch and pointer (like iPads). 
- **Fix Required:** Ensure touch detection is strictly disabling the custom cursor div via CSS media queries (`@media (pointer: coarse)`) or JS feature detection.

---
*Note: The production build is currently passing with 0 TypeScript and 0 Vite build errors.*
