# Alvik hardware capabilities: what Pip 4.0 supports

| Alvik hardware / behavior | Pip 4.0 support | Important limitation |
| --- | --- | --- |
| Two drive motors | ✓ timed legacy commands and measured move/rotate | Wheel slip; not perfect precision |
| Wheel encoders / dead reckoning | ✓ x/y/heading, wheel angles, trip distance | Drift accumulates; no absolute localization |
| Return to start | ✓ limited direct path up to ~120 cm | Not GPS or map planning; stops on obstruction |
| Five-zone ToF sensor | ✓ filtered & adjustable display offsets | No guarantee for every surface; unknown = unsafe |
| Upper/lower ToF zones | ✓ periodic optional readings if library supports | Not validated as edge detection |
| Downward color sensor | ✓ color labels and color-hunt score | Requires floor under robot, light affects readings |
| Downward line sensors | ✓ three readings in dashboard | Full line-following closed-loop algorithm not added |
| 3-axis accelerometer/gyro/IMU | ✓ roll/pitch/yaw through Alvik orientation API | Orientation may be noisy/drift |
| Battery charge | ✓ dashboard | Report depends on firmware API |
| Touch OK, center, arrows, CANCEL | ✓ periodic button-state mask; physical CANCEL emergency stop | No gesture recognition |
| Two RGB LEDs | ✓ mood color commands | Values depend on compatible firmware |
| Front illuminator | ✓ on/off | Hardware dependent |
| External servos / Qwiic / Grove / I²C | Documented expansion availability; **not remotely controlled** | Requires attached compatible hardware, its own tested driver and safety constraints |
| Microphone and speaker | Browser computer/device only | Alvik itself has no built-in mic or speaker |
| Camera, object recognition, human tracking | ✗ Not built into Alvik | Cannot identify a person or recognize a toy by appearance |
| Rear obstacle detection or reliable cliff protection | ✗ | No rear sensor/certified cliff detection; do not use unattended |
| Wi-Fi / remote connection to physical robot | ✗ in this build | Browser uses nearby BLE; hosting Github Pages does not turn BLE into internet control |

The latest Alvik SDK supports further features; implementing or validating every optional hardware extension would require the actual devices and hardware tests. Do not assume a connected servo or external module is safe to actuate based on this project alone.

## Autonomous goal behavior

**Explore:** Moves forward in short bounded segments when front sensor readings are valid, otherwise turns, chooses another route. The goal is exploring clear space, not building a room map.

**Tag:** Follows a nearby object in the center ToF beam (typically a hand or flat target). When it gets very close, it records a tag and pauses. It does not recognize/track people or distinguish them from other obstacles.

**Color Hunt:** Moves on a clear floor and scores changes in the downward surface color label. It does not visually seek colored objects from across the room.

Games in the browser: **Rock Paper Scissors, Number Guessing, Memory Challenge**. These do not need Gemini or Bluetooth.
