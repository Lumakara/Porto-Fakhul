# Background Music

Drop your local audio files here. The settings panel playlist maps to these
filenames (configured in `src/data/music.ts`):

| Playlist     | Expected file                   |
| ------------ | ------------------------------- |
| Ambient      | `public/music/ambient.mp3`      |
| Lo-Fi        | `public/music/lofi.mp3`         |
| Electronic   | `public/music/electronic.mp3`   |
| None         | (silence — no file needed)      |

Notes:
- `.mp3` is the safest cross-browser format. `.ogg` / `.m4a` also work if you
  update the `src` paths in `src/data/music.ts`.
- Files in `public/` are served from the site root, so `public/music/ambient.mp3`
  is referenced as `/music/ambient.mp3`.
- Browsers block autoplay until the user interacts with the page; music starts
  when the user enables it in Settings (or right after their first click).
- Keep files reasonably small (a 1–3 min loop) for fast loading.
