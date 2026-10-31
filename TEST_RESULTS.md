# Pip 4.0 — Test and validation report

## Automated verification (offline)

The suite `development/run_tests.sh` passed:

- JavaScript syntax: movement parser, game engine, memory manager, dashboard logic, Apps Script backend (copied to `.js` for Node syntax checking)
- MicroPython code **CPython syntax** compilation (not a substitute for a MicroPython hardware run)
- 21 Node assertions: exact move units, compound left-turn + 1 foot, stop, negative commands, input boundaries, return-home routing, modes, 200-note memory, edit/remove, import/export, and games
- Browser-script initialization using a mocked DOM (no JavaScript exception), plus movement-plan preview
- All dashboard JavaScript selectors found in HTML
- Apps Script normalization: valid AI plan, reject out-of-bounds, reject non-motion, reject when robot disconnected
- Simulated Alvik + BLE main loop: reset origin, exact distance, turn, return-to-start route, completion acknowledgements, brake

**Important:** I tried a real headless Chromium local test, but this execution environment blocked navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. That is an infrastructure limitation, not a pass/fail for Pip. The project was therefore tested through syntax, mock DOM, backend, and simulated firmware—not live in Chrome from a GitHub Pages site.

## Not verified — test with hardware

- Whether actual Alvik MicroPython carrier firmware version and library support every function exactly as expected
- Actual travel distance/turn accuracy and odometry drift on your floor
- Physical emergency braking, Bluetooth link stability under real sensor traffic
- Return-to-start safety with real obstacles, calibration offsets, and longer movement sequences
- Live Gemini response from your account and Web Bluetooth behavior from your deployed GitHub URL
- Smartphone/browser voice availability and different voices

**No software author can guarantee this type of robot is free of bugs without real-world tests.** Do not treat these offline results as physical safety certification.

## Installation acceptance tests

1. After firmware update: BLE connects, stationary for 2 minutes, wheels remain locked.
2. Request live sensors, position, line sensor and battery values; missing sensors must appear unavailable.
3. With wheels raised, try 10° left turn and 5 cm forward, then STOP.
4. On clear enclosed floor, Mark start; move 10 cm; observe position change and return under supervision.
5. Stop in mid-step, try physical CANCEL, verify that movement stops and cannot resume until deliberate reset.
6. Put an opaque object close to center ToF and request forward motion: it should refuse/stop.
7. Disconnect Bluetooth during a small step: wheels should brake.
8. Test games and memory without Bluetooth. Test Gemini separately through Test AI connection.

Read `INSTALL.md` and `SENSOR_CALIBRATION.md` before enabling autonomous goals.
