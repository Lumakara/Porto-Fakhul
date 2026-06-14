# CV / Resume PDFs

The "Download CV" button in the **About** section opens a menu with three
résumé variants. Drop your real PDF files here using these **exact filenames**
(everything in `/public` is served from the site root):

| Menu item        | Required file path              | Public URL          |
| ---------------- | ------------------------------- | ------------------- |
| CV ATS Web Dev   | `public/cv/cv-ats-web-dev.pdf`  | `/cv/cv-ats-web-dev.pdf`  |
| CV ATS Umum      | `public/cv/cv-ats-umum.pdf`     | `/cv/cv-ats-umum.pdf`     |
| CV Design Umum   | `public/cv/cv-design-umum.pdf`  | `/cv/cv-design-umum.pdf`  |

## Notes

- Filenames are **case-sensitive** on the production host (Vercel/Linux). Use
  lowercase exactly as shown above.
- Keep each PDF reasonably small (ideally < 2 MB) so downloads are fast.
- If a file is missing, the browser will show a 404 when that menu item is
  clicked — the rest of the site keeps working.
- To change the filenames or add/remove variants, edit the `cvFiles` array in
  `src/sections/About.tsx` and the matching `about.cv.*` labels in
  `src/locales/{en,id,zh}.json`.
- Do **not** put sensitive personal data (full home address, ID numbers, phone
  numbers you don't want public) in a CV that is publicly downloadable.
