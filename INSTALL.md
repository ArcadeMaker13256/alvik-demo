# Pip 4.0 — Update from your already-working GitHub + Gemini project

## BEFORE CHANGING ANYTHING

1. Download a backup of the old GitHub files: `index.html`, `pet_commands.js`, `pip_memory.js` if present, and **your currently working Arduino Alvik `main.py`**. Save them to a local backup folder.
2. Charge Alvik. Disconnect it from the browser. Never upload or test robot code while motors can roll on a table. Keep it on a secure surface with wheels raised.
3. **Do not** change or expose the existing `GEMINI_API_KEY` / `APP_PIN`. These remain in Google Apps Script's Script Properties. Do not upload secrets to your public GitHub repository.
4. The new GitHub files and firmware **must be deployed together**. The earlier Alvik program understands `M`, but does not understand `V`, `T`, `Z`, `G`, sensor offsets or advanced telemetry.

## Part A — GitHub Pages (website)

In your **existing** working GitHub Pages repository (the one with Pip):

- Replace repository-root `index.html` with `index.html` from this ZIP.
- Add/replace alongside it: `pip_commands.js`, `pip_games.js`, `pip_memory.js`.
- You may remove the old `pet_commands.js` from the website if it was previously present. The new page does not load it.
- Keep repository Pages settings pointing to `main` → `/(root)` and leave `.nojekyll` if you have it.
- When published, refresh your browser with **Ctrl+Shift+R**.

**The GitHub website remains PUBLIC.** Never add your Google API key, Apps Script private passphrase, Windows credentials, or home Wi-Fi passwords to it. Your backend URL can be entered on the website as before.

## Part B — Google Apps Script (AI)

1. Open your *existing* Pip project at https://script.google.com/home.
2. Replace the contents of `Code.gs` with the packaged `apps_script/Code.gs`. The backend keeps the previous iframe/form method that was working for you.
3. Confirm Script Properties remain set (`GEMINI_API_KEY`, `APP_PIN`, `GEMINI_MODEL`, `APP_ORIGINS`). For GitHub Pages `APP_ORIGINS` is `https://YOUR-USERNAME.github.io` — origin only, **not** `/pip-pet/`.
4. **Deploy → Manage deployments → Edit (pencil) → New version → Deploy.** This updates the existing `/exec` URL.
5. On your Pip website, enter the same `/exec` deployment URL and PIN and click Test AI connection. If chat fails, check Apps Script Executions. No new API key is required.

## Part C — Robot firmware (REQUIRED for new movement protocol)

1. Connect Alvik by USB-C data cable in Arduino Lab for MicroPython or `mpremote`.
2. **Back up its existing `main.py` first.** The included `robot/main.py` is a new full replacement, not an extra script to run alongside the old one.
3. Upload the new `robot/main.py`, ensure the Arduino Alvik MicroPython library and carrier firmware versions are compatible, and restart Alvik.
4. Close other Pip tabs. Open GitHub Pages in **Chrome/Edge on Windows**, select `Alvik-AI`, and leave all motors LOCKED for 2 minutes to confirm BLE stability. Your Windows Bluetooth power setting may still be important.
5. Only then try a short move with **wheels raised**. First `turn left 10 degrees`, then `move forward 5 cm`; review the plan, unlock movement and approve, observe motor acknowledgements. This is not proof of floor accuracy.
6. Place the robot on a clear, enclosed **floor** away from any ledges/stairs. Mark start while stationary, and test a 10 cm forward move, then a 30° turn. Measure actual vs requested displacement to estimate error.
7. Only after these tests use Return to start or goal games. Always keep STOP in reach and the browser tab visible.

## How exact commands work

After clicking Connect Alvik, check Unlock motor movement. Speak or type:

`Turn 90 degrees left and move forward 1 foot`

Pip will **preview**: `turn 90° → move 30.5 cm`. Click **Approve & execute**. You can cancel the preview without moving. It waits for the robot to report completion of each step. A timeout or obstacle cancels the remaining sequence.

`Mark start` resets wheel odometry; `How far from start?` reports position relative to that reset and cumulative distance; `Return to start` estimates a short direct route. No map is involved; it may not be able to return through obstacles.

## First-run calibration

Go to `Hardware capabilities & sensor tuning`. Compare each distance reading against a matte, flat surface at a known ruler distance, e.g. 30 cm. Choose the appropriate direction zone and enter **actual minus measured**, rounded to an integer from -10 to +10 cm. This corrects the **displayed reading** in software; it cannot fix glass/reflections, calibration variability, or a dead sensor. See `SENSOR_CALIBRATION.md`.

## Recovery / rollback

If Bluetooth becomes unstable or the new firmware cannot read the Alvik library, restore the backed-up `main.py` using USB; then restore your backed-up `index.html` and Apps Script version. The old app will then work with the previous protocol. Do not blindly try to force new precision commands on the old firmware.

**Advanced technical caveat:** The AI backend is still a public `/exec` endpoint with a strong private PIN, not account-level per-user authentication. Do not share PIN. Use caution if hosting on a public GitHub Pages repository and avoid uploading private memory exports.
