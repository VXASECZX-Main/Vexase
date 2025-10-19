# Futur — Static Frontend Demo (No Server)
This is a **frontend-only** mini social app demo. It implements **signup, login, and posts** entirely in the browser using `localStorage`. This is ideal for hosting on **GitHub Pages** or any static host.

## What it includes
- `index.html` — Login page
- `signup.html` — Sign-up page
- `home.html` — Feed page (create posts)
- `css/style.css` — Clean Apple-like styling
- `js/main.js` — Auth & posts logic (localStorage)
- `assets/favicon.svg` — Icon
- `README.md` — This file

## How it works (short)
- Users created via the sign-up form are saved in `localStorage` (key: `futur_users_v1`).
- Logging in sets the current user (`futur_current_user_v1`).
- Posts are saved in `localStorage` (key: `futur_posts_v1`) and shown in the feed.
- No backend or server code — intended for demo & learning.

## Deploy to GitHub Pages
1. Create a new repository on GitHub.
2. Upload the site files (or push the repo with these files).
3. In repo settings -> Pages, set branch to `main` (or `gh-pages`) and folder `/`.
4. Wait a minute — your static site will be served at `https://<username>.github.io/<repo>`.

## Notes / Security
- This demo **is not secure**: passwords are only lightly hashed for UX and stored client-side. **Do not** use real credentials.
- To convert to a production app, add a real backend and database.

