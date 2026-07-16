# World Cup Check-In

Static mobile-first QR check-in website for a private church World Cup watch party. The site reads the `family`, `ticket`, and `guests` values from the URL query string and shows a personalized entry confirmation screen with sound, animation, and a reset state for the next guest.

## Project Files

- `index.html`
- `styles.css`
- `script.js`
- `.gitignore`

## How It Works

Open the deployed page with a URL like:

```text
https://reisd.github.io/wc-watchparty/?family=Kim%20Family&ticket=001&guests=4
```

The page will:

- Read the query parameters from the URL.
- Display the family name, ticket number, and guest count.
- Show a short scan animation followed by an entry confirmation state.
- Play a subtle confirmation beep when the browser allows it.
- Show a tap-to-confirm fallback if mobile autoplay is blocked.
- Launch lightweight local confetti with no CDN or backend.

## GitHub Pages Deployment

1. Create a new GitHub repository, or reuse an existing one such as `wc-watchparty`.
2. On your computer, create a local folder for the website files.
3. Copy these project files into that folder:
   `index.html`, `styles.css`, `script.js`, `README.md`, `.gitignore`
4. Open a terminal in the `world-cup-checkin` folder.
5. Run:

   ```bash
   git init
   git add .
   git commit -m "Add World Cup check-in website"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```

6. In GitHub, open the `world-cup-checkin` repository.
7. Click `Settings`.
8. In the left sidebar, click `Pages`.
9. Under `Build and deployment`, choose:
   `Source: Deploy from a branch`
10. Under `Branch`, choose:
    `main` and `/root`
11. Click `Save`.
12. Wait for GitHub Pages to finish publishing.
13. Open the final site URL, which will normally be:

    ```text
    https://USERNAME.github.io/REPOSITORY/
    ```

14. Test a personalized URL by adding the query string values, for example:

    ```text
    https://USERNAME.github.io/REPOSITORY/?family=Kim%20Family&ticket=001&guests=4
    ```

15. Generate QR codes from each final personalized URL.
    You can use any QR code tool you trust, or generate them locally with a command-line tool such as `qrencode`.
16. Print each QR code on the matching family ticket.
17. Scan a printed ticket with a phone camera to verify the personalized page opens correctly.

## Sample Ticket Links

Replace `USERNAME` with your GitHub username.

1. Kim Family, Ticket 001, 4 guests

   ```text
   https://USERNAME.github.io/REPOSITORY/?family=Kim%20Family&ticket=001&guests=4
   ```

2. Lee Family, Ticket 002, 3 guests

   ```text
   https://USERNAME.github.io/REPOSITORY/?family=Lee%20Family&ticket=002&guests=3
   ```

3. Park Family, Ticket 003, 5 guests

   ```text
   https://USERNAME.github.io/REPOSITORY/?family=Park%20Family&ticket=003&guests=5
   ```

4. Jung Family, Ticket 004, 2 guests

   ```text
   https://USERNAME.github.io/REPOSITORY/?family=Jung%20Family&ticket=004&guests=2
   ```

5. Choi Family, Ticket 005, 4 guests

   ```text
   https://USERNAME.github.io/REPOSITORY/?family=Choi%20Family&ticket=005&guests=4
   ```

## Notes

- No backend, database, authentication, analytics, cookies, or tracking are used.
- URL values are sanitized before display and inserted with `textContent`.
- Reduced motion users get a simpler confirmation flow without heavy animation.
- If `family` is missing, the page shows `Guest Family`.
- If `ticket` is missing, the page shows `General Admission`.
- `Jung Family` now has a custom gallery fed by local image files in `assets/jung-family/`, so you can replace those SVG files with real pictures later without changing the JavaScript.
