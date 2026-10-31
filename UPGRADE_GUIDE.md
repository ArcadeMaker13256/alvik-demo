# 🐾 Pip 3.2 — Smarter Brain + Expressive Voice

This is an update to the **working Pip GitHub Pages website**, not a new robot firmware install. **Keep your working Alvik `main.py` and Bluetooth setup untouched.**

## What's new

- **Memory box:** Say **"Remember that I love space games"**, then **"What do you remember?"**. Pip keeps up to 12 explicitly taught notes on *that browser*, shows them in the app, and has a **Clear memory** button. This is not a universal cloud memory; a second device starts with its own empty memory.
- **More intelligent chat:** Gemini receives recent chat turns, current Play/Rest state, a fresh five-zone distance snapshot, the downward color value, and your optional saved notes. The pet persona gives better explanations when asked, while remaining playful and never pretending to be a human.
- **Expressive voice:** Four voice personalities, a browser voice picker, pitch and speed sliders, more distinct electronic chirps, mood-based speech delivery, voice preview, and saved per-browser voice preferences.
- **Same safety:** Gemini cannot command motors directly. Short deterministic movement commands, the motion unlock, BLE safety heartbeat, robot obstacle checks, and emergency stop remain unchanged.

## Update your GitHub website

1. Extract `Pip_3_2_Intelligence_Voice.zip`.
2. Open your GitHub repository `pip-pet`.
3. Replace the **root** `index.html` with the one in this ZIP.
4. Upload the new **root** `pip_memory.js` next to `index.html` and `pet_commands.js`.
5. Leave your existing `pet_commands.js` and GitHub Pages settings alone.
6. Open the GitHub Pages Pip website and hard-refresh with **Ctrl + Shift + R**.

**Important:** Both files (`index.html` and `pip_memory.js`) must be in the repository **root**. The new page references `pip_memory.js`. A missing file can make the new chat interface fail to load.

## Update Gemini intelligence on Apps Script

1. Go to [Google Apps Script](https://script.google.com/home) and open the Pip backend project that already works.
2. Open `Code.gs`, replace the existing source with **`development/apps_script/Code.gs`** from this ZIP, then save.
3. Go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**.
4. Keep your existing `GEMINI_API_KEY`, `APP_PIN`, `APP_ORIGINS`, and Gemini model Script Properties. **Do not put API keys or the PIN in GitHub.**
5. Refresh the public website and click **Test AI connection**.

Your Apps Script `/exec` URL should remain the same if you edit the existing deployment (not create a new one). If the old website still works but the new features don't, check that you deployed a **new version**, rather than only saving the code.

## Good first tests

- With **Play Mode OFF** and **wheel movement locked**, chat: “What can you sense?” Pip should only talk about the data it actually has. With no robot connected, it should say readings are unavailable.
- Say: “Remember that my favorite animal is a fox.” Then ask: “What is my favorite animal?” Enable the memory checkbox; the memory stays on your current browser and is included in Gemini requests.
- Say: “What do you remember?” and then press **Clear memory**.
- Under voice settings, select **Playful space-pet Pip**, adjust pitch and speed, and click **Hear Pip**. For clearer speech, try **Bouncy Pip**; the installed system voices determine the real audio quality.
- Connect your robot and test movement **with wheels raised first**, as before. No robot firmware update should be required.

## Limits and privacy

- The voice plays on the browser/device, **not on Alvik's hardware**. Voices differ across Windows, Android and other devices. A custom studio-quality character voice would require recorded samples or a separate text-to-speech audio service.
- Memory notes are saved in the browser's local storage and sent to Gemini as additional text **only when memory is enabled** and you make an AI request. Do not teach Pip passwords, addresses or other secrets. Clear memory using the button at any time. Clearing browser site data may also erase memories.
- The chat history is short-term and resets on refresh; the explicit memory box persists on that browser. Other devices do not share that history or memory automatically.
- GitHub Pages is a public website. Your Apps Script endpoint and PIN are used in the browser; use a strong private PIN, watch Gemini usage, and do not share the configured admin session.
- The original motor safety behavior remains in place; Pip **cannot detect stairs or ledges**. Always supervise Play Mode in an enclosed floor area.
- This ZIP was checked with JavaScript/Python tests but not exercised on your real Alvik, your deployed Apps Script, or every browser voice engine.
