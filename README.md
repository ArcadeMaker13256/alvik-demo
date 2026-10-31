# Pip — Playful Arduino Alvik Robot Pet 🐾

This is the complete **Pip 3.2** browser dashboard and development source. The **hosted website** at the repository root contains all the existing features: Gemini chat, pet-like personality and voice, Web Bluetooth controls, sensor readouts, Play/Rest Mode, wheel safety controls, manual tricks, and connection diagnostics. Pip’s firmware and Gemini Google Apps Script source are kept under `development/` for reference and updates.

## Publish on GitHub Pages

1. Create a public repository named `pip-pet` in your GitHub account (or connect GitHub in ChatGPT for assisted publishing).
2. Upload **the contents** of this extracted folder to the **root** of the repository. `index.html`, `pet_commands.js`, and `pip_memory.js` must sit next to each other in the repository root. Do not upload the ZIP as a single file.
3. Open **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, then `main` and `/(root)`, and Save.
4. Your site address will be `https://YOUR-USERNAME.github.io/pip-pet/`. Substitute your real GitHub account name.

## Connect your existing Gemini AI

The website does **not** contain your Gemini API key, Apps Script deployment URL, or your private PIN. Keep using your existing deployed Google Apps Script backend. In Apps Script → Project Settings → Script Properties, make sure `APP_ORIGINS` contains the URL origin (without `/pip-pet/`):

`http://localhost:8000,https://YOUR-USERNAME.github.io`

Keep the real `GEMINI_API_KEY` and `APP_PIN` in Google Apps Script **Script Properties only**. Open the hosted website, enter your existing Apps Script `/exec` URL and private PIN, and click **Test AI connection**.

## How the robot connects

- **Nearby Alvik:** Bluetooth connection can work in supported browsers (Chrome/Edge on Windows, Chrome on compatible Android devices) over HTTPS. Users must explicitly connect to their nearby Alvik. Do not use the site for unattended autonomous operation.
- **Remote devices:** They can use the AI chat interface, subject to browser/voice support and correct backend configuration. A remote browser **cannot control your Alvik at home** just because the page is hosted online. That would require a separate authorized local bridge.
- **iPhone/iPad:** Browser support for Web Bluetooth varies; expect AI text chat, not direct Alvik Bluetooth control in normal iOS browsers.
- **GitHub Pages is static hosting:** Google Apps Script remains the separate Gemini backend; the robot still uses MicroPython firmware.

## Developer source

- `development/robot/main.py` — physical Alvik firmware (not executed by GitHub Pages).
- `development/web_app/` — original development HTML/JavaScript for local tests.
- `development/apps_script/Code.gs` — Gemini AI backend source (must be manually deployed in Apps Script).
- `development/tests/` — simulated tests (not a substitute for hardware safety testing).
- `development/PERSONALITY.md` — Pip’s pet behavior design.
- `development/README.md` — installation, safety and behavior specifics.

## Safety and security

**GitHub Pages publishes the website publicly.** Repository source is visible to others. Never commit API keys, PINs, private links, tokens or credentials. The files in this package contain placeholders, not personal API credentials. The Apps Script PIN is a prototype-only safeguard, not a full user account or abuse-prevention system; monitor usage. Always supervise Play Mode in an enclosed, ground-level space away from stairs and ledges; the robot cannot reliably detect edges. Restart Bluetooth and check Windows adapter power settings if disconnections recur.

Pet memory and expressive browser voice were added to the working Pip 3.1 Bluetooth code; no live GitHub publishing or physical hardware testing is implied.

## Upgrade from your existing GitHub website

See **[UPGRADE_GUIDE.md](UPGRADE_GUIDE.md)** for the shortest update route: replace only the root `index.html`, add root `pip_memory.js`, and deploy the updated `development/apps_script/Code.gs`. The robot `main.py` stays unchanged.
