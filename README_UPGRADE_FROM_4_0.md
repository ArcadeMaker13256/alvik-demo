# Pip 4.0 -> 4.2: Direct motion + hands-free microphone

This is the minimal update for an existing, WORKING Pip 4.0 installation.

## 1. Back up
Save a copy of your current GitHub repository files and the previous Apps Script `Code.gs`. Keep your robot `main.py` backup in case you later change hardware software.

## 2. Update the existing GitHub Pages repository (root folder)
- Replace `index.html` with `index.html` from this package.
- Replace `pip_commands.js` with `pip_commands.js` from this package.
- Add `pip_mic.js` beside those files. It is NEW in 4.2.
- KEEP the existing `pip_games.js` and `pip_memory.js`: they have not changed since 4.0.
- KEEP the existing `.nojekyll` and any other unrelated files.
- Commit changes and wait for GitHub Pages to finish publishing, then reload with Ctrl+Shift+R.

## 3. Update Google Apps Script
- Open your existing Pip Apps Script project.
- Replace its `Code.gs` with `apps_script/Code.gs` from this package.
- Do NOT change or publish your private `GEMINI_API_KEY` or `APP_PIN`.
- Confirm that `APP_ORIGINS` includes your GitHub Pages origin, e.g. `https://YOUR-USERNAME.github.io` (no `/pip-pet` path).
- Save and go to Deploy -> Manage deployments -> Edit -> New version -> Deploy.
- Keep using your existing `/exec` URL and private PIN.

## 4. Robot
You do NOT have to update the robot if it already runs Pip 4.0's `robot/main.py`.

## 5. Check in a safe order
1. Open your GitHub Pages website in Windows Chrome/Edge. Click Test AI connection.
2. With wheel movement LOCKED, click Mic ON; grant browser permission. Say "Pip, what can you do?" and "Pip, stop listening".
3. Turn the mic on again and try "Pip, stop" (STOP should always be accessible).
4. Raise the Alvik wheels off the floor, connect Bluetooth, unlock movement, and say "Pip, turn left ten degrees", then "Pip, move forward five centimeters".
5. Verify every action and emergency stop before floor testing. Test on a clear, enclosed floor away from stairs, edges or hazards.

## Important
- No per-command approval for clear forward/turn commands once wheel movement is explicitly unlocked; normal physical safety limits and collision checks remain.
- Backward movement and return-to-start still involve confirmation because of sensing/odometry limitations.
- Hands-free mic stays enabled for the visible open tab, with automatic recognition restarts when possible. Browsers may pause/interrupt it. Mic starts OFF when you reload, for privacy.
- The web page is public on GitHub Pages. NEVER upload API keys, passphrases, or personal memory exports.
- This update was compared with 4.0 file versions; it still needs live verification on your setup.
