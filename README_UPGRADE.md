# Pip 4.2 normal -> Pip 4.2 with 10-foot motion + collision ON/OFF

This is the **combined direct upgrade** from the original standard Pip 4.2. It includes **both** enhancements in one package. You do **not** need to install the separate 10-foot update first.

## What changed
- Maximum forward distance: **10 feet = 304.8 cm per movement** (and 304.8 cm total forward/reverse travel per AI plan).
- Collision Prevention checkbox: ON by default. Can be set OFF for **supervised manual/direct AI commands only** while the wheels are unlocked; OFF bypasses frontal obstacle checks.
- Automatic Explore/Tag/Color Hunt/Return to start require collision prevention ON.
- Emergency STOP, loss-of-connection stops, and 10-foot movement limit remain active.
- Protection resets to ON after restart, disconnection, or emergency stop.
- Direct AI commands and hands-free mic from Pip 4.2 stay supported.

## Install: four files (back up originals first)

1. **GitHub repository:** Replace the root `index.html` and `pip_commands.js` from this ZIP. Keep the existing `pip_mic.js`, `pip_games.js`, `pip_memory.js` unchanged.
2. **Google Apps Script:** Replace your Pip backend's `Code.gs` with `apps_script/Code.gs`. Save, then **Deploy > Manage deployments > Edit > New version > Deploy**. Keep your existing Script Properties (API key, PIN and origin list); never put them in GitHub.
3. **Arduino Alvik:** Back up the robot's current `main.py` and replace it with the included `robot/main.py` using Arduino Lab for MicroPython and a USB-C data cable. Restart the robot. **This is required:** old robot firmware still rejects >50 cm and doesn't understand the collision switch.
4. Refresh the GitHub site with `Ctrl+Shift+R`, then connect Alvik and unlock movement.
5. Test with wheels raised: STOP, a 5 cm forward command, ON/OFF switch acknowledgement. The website must indicate that the robot confirmed the setting.
6. On a clear **level enclosed floor**, try short supervised moves before increasing toward 10 feet.

## Safety notes
- Collision Prevention **OFF** means the robot may drive straight into obstacles and still cannot detect stairs/edges reliably. Keep a hand near STOP and use ONLY in known-clear, enclosed, level space while directly supervising. Do not use near people, pets, walls, furniture, or drop-offs.
- A 10-foot command is the **maximum**, not a promise of 10-foot accuracy. Wheel tracking may drift, surfaces slip, and long motions may be interrupted by safety controls.
- Mic and Gemini are unchanged as separate systems; they should be tested live after uploading the upgrade.
- The source project's automated/offline suite passed, but this specific physical robot and deployment have not been tested.

## Folder map
- `index.html` -> GitHub repository ROOT
- `pip_commands.js` -> GitHub repository ROOT
- `apps_script/Code.gs` -> Google Apps Script editor (NOT GitHub public repository)
- `robot/main.py` -> actual Alvik robot (NOT GitHub Pages web files)
