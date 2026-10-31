# Pip 4.0 — Alvik Robotics Lab

Pip is a useful, lively **robot assistant**, not a pretend animal. This release updates the **GitHub Pages dashboard**, the **Google Apps Script / Gemini backend**, and the **Arduino Alvik MicroPython firmware**.

**Start here:** Read `INSTALL.md` before replacing code. It is especially important to update `robot/main.py` as well as the website. None of the new precise movement commands work with the old robot program.

## Features

- **Exact *requested* move distances and angles:** e.g. `turn 90 degrees left and move forward 1 foot` (converted to approximately 30.5 cm). Alvik's onboard kinematic functions are used; actual movement is still approximate and subject to wheel slip, floor surface and hardware/firmware accuracy.
- **Starting pose and cumulative trip distance:** display x/y/heading and estimated path length from wheel-based odometry. `Mark start` resets the origin while stopped.
- **Return to start:** requires direct user confirmation and an unlocked robot, and attempts a direct, forward-only return within 120 cm of the estimated origin. **Not GPS, obstacle-aware pathfinding, SLAM, or guaranteed safe navigation.** The robot stops if the forward path is obstructed; never use near edges, stairs or on elevated surfaces.
- **Gemini planning with human approval:** Gemini may propose safe bounded step lists, but never gets to run motors directly. Browser validates and previews plans; an explicit Approve button is required.
- **Purposeful autonomous modes:** Explore, Tag (center-beam proximity target, **not person recognition**), Color Hunt (downward surface labels). Every mode requires an unlocked, visible browser and BLE heartbeat.
- **Games:** rock-paper-scissors, number guessing, and sequence memory challenge. Games work even when robot/Gemini are disconnected.
- **Memory Manager:** 200 editable searchable browser-local notes, export/import JSON, explicit save/forget actions. Only up to 12 relevant notes are sent to Gemini with a request. **Not automatically synchronized across devices.**
- **More sensor information:** five forward ToF zones, occasional top/bottom zones (when supported), filtered distance measurements, calibration offsets, battery, wheel position, pose, orientation, line sensors, touch-button bitmask, RGB LED states, illuminator.
- **Assistant personality and browser speech:** natural, clear, playful without pet/dog language, voice pitch/rate and voice selector.

## Safety limitations

- Keep robot on a **clear, enclosed floor** with adult supervision; no edges/stairs/elevated surfaces. **No dependable edge, rear-obstacle, person or object detection.**
- `CANCEL` on Alvik is an **emergency stop** that latches until manually reset; software STOP and emergency STOP exist too.
- Forward distance fails **closed** when center sensor is missing; offsets cannot weaken the conservative safety threshold.
- Per-step limits: forward <= 50 cm, reverse <= 15 cm, turn <= 180°. Per planned sequence <= 5 steps, total <= 100 cm travel, <= 360° turn. Reverse is particularly dangerous because there is **no rear distance sensor**; it requires an additional confirmation.
- On BLE disconnect, manual STOP, missed browser heartbeat, or a moving-target timeout, software brakes. Physical interruption / power loss may still create unpredictable behavior.
- Each motion gets a timeout even if Alvik's hardware reports no completion. Short motors-only tests first with wheels raised, then test short strokes in a safe floor area.
- Model plans cannot bypass browser confirmation and firmware limits. This is a prototype, not safety-certified navigation.

## Quick examples

- `Mark start`
- `Move forward 1 foot`
- `Turn 90 degrees left and move forward 1 foot`
- `How far from start?`
- `Return to start` (confirmation + max 120 cm direct route)
- `Play tag` (approach an object in the center beam)
- `Find colors`
- `Play rock paper scissors`
- `Remember that my favorite game is chess`

## Source and compatibility

Built around the working Web Bluetooth service IDs from Pip 3.1/3.2 and documented Arduino Alvik library calls (`move`, `rotate`, `get_pose`, `reset_pose`, `get_distance`, `get_line_sensors`, `get_wheels_position`, `get_orientation`, etc.). Use a **matching** Alvik MicroPython library and carrier firmware. The October 2026 Alvik library 1.1.0 changed some APIs and requires matched firmware.

Official Arduino sources:
- https://docs.arduino.cc/hardware/alvik
- https://github.com/arduino/arduino-alvik-mpy
- https://github.com/arduino/arduino-alvik-mpy/releases
- https://docs.arduino.cc/tutorials/alvik/api-overview/

Gemini API: https://ai.google.dev/api/generate-content

See `CAPABILITIES.md`, `SENSOR_CALIBRATION.md`, `INSTALL.md`, and `TEST_RESULTS.md`.
