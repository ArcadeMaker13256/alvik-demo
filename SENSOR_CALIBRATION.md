# Making Alvik's distance sensor more reliable

The Alvik uses a multi-zone time-of-flight (ToF) sensor. Hardware readings vary with surface reflectance, target angle, ambient lighting, motion and sensor firmware. One constant software offset cannot correct every kind of error.

1. Place Pip on a **stationary, level, safe floor** with motors locked. Avoid table edges.
2. Use a large, flat, matte, opaque target (e.g. plain cardboard). For the center zone, put it perpendicular to the robot at a ruler-measured 30 cm from the sensor face. Try 20 cm and 50 cm too.
3. Read five-zone values; wait 3–5 seconds for the median filter to fill. `—` means unknown, **not** a free path.
4. If the **center** reports 26 cm when the target is 30 cm, select Center and set correction **+4 cm**. If it reports 34 cm, use **−4 cm**.
5. Repeat with targets angled toward left, center-left, center-right and right; each zone points in a different direction. Save each as integer between −10 and +10 cm. Compare at multiple distances. If the reading error changes strongly with distance, do **not** treat a single offset as trustworthy.
6. If a zone persistently fails or jumps wildly, clear its offset, clean the front sensor, ensure stable power, and check Arduino's official firmware/library update instructions. Try a matte surface and remove mirrors/glass/shiny/black/translucent targets from test path.
7. Run only short supervised moves after verifying the readings. **Positive offsets do not weaken the raw obstacle stop thresholds.** If center distance is missing or too close, forward movement is blocked regardless of calibration.

## What this update actually changes

- Five recent raw samples are retained; displayed values use median of at least three valid samples per zone.
- A very close single *raw* center reading triggers immediate stop; the robot also checks uncorrected center median so positive offsets cannot make a dangerous distance appear safe.
- Missing center samples prevent forward movement. Clearances checked before and during movement.
- The browser saves per-zone offsets in its own local storage and sends all five each time it reconnects. They are held in robot RAM (lost after power cycle until your same browser reconnects).

**Limits:** The sensor cannot be made absolutely precise through code alone. A lens occlusion, glass, a target out of view, geometry and sunlight interference may not be correctable. Do not lower collision thresholds just to make it move.
