# 🪱 Sandworm Overlay

A transparent, always-on-top desktop overlay for **Dune: Awakening** deep-desert
sand crawling. It shows a **phase-lock loop timer** that cycles once every **2:30**
(your safe crawl window before the worm aggros).

There's **no start button** — that's the point. When you land, glance at where the
marker is, then bail when it comes back round to the same spot. One full lap is
exactly your 2:30, no matter where in the loop you landed.

## Two views (switchable)

- **Spice Dial** — a 12-zone colour wheel with clock numbers and 60 ticks. The
  glowing dot takes on the colour of the zone it's in, and the centre shows that
  zone number. Remember _"orange, 4"_ → bail when it's orange-in-4 again.
- **Spice Bar** — the same colour + number coding across 15 segments along a
  thin bar. Easy to pin along a screen edge. Remember _"seg 9"_.

Both make every position a distinct landmark (colour **and** number **and** tick
density) so whichever cue your eye caught on landing is enough to re-find it.

## Controls (global hotkeys — work even while the game has focus)

| Shortcut     | Action                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------- |
| `Ctrl+Alt+M` | Switch between **dial** and **bar**                                                        |
| `Ctrl+Alt+O` | Toggle **interactivity** — unlock to drag/reposition, lock again to make it click-through |
| `Ctrl+Alt+X` | Quit                                                                                       |

By default the window is **click-through** (clicks pass to the game) and parked
top-right. Hold `Ctrl+Alt+D` and drag with the mouse to reposition it, then
release to re-lock as a pure overlay.

### Tray (menu-bar) icon

The app is hidden from the dock/taskbar to stay out of the way, so it lives in
the **system tray / menu bar** instead. Click the icon for a menu:

- **Switch dial / bar**
- **Quit Sandworm Overlay** — the easy way to close it (besides `Ctrl+Alt+X`)

## Run it

```sh
mise install            # provides Rust + Node (see ../mise.toml)
npm install
npm run tauri dev       # dev window with hot-reload
```

## Build a distributable app

```sh
npm run tauri build     # produces a .app / .dmg under src-tauri/target/release/bundle
```

## Notes

- The loop phase is derived from the wall clock (`now mod 150s`), so it's
  identical across restarts — closing and reopening the app doesn't matter,
  only "same spot again" does.
- Transparency on macOS uses the `macos-private-api` feature + `macOSPrivateApi`
  config flag.
- Global shortcuts on macOS may require granting the app Accessibility / Input
  Monitoring permission the first time, depending on OS version.

## Tuning

Change the safe window: edit `WIN` in `src/main.js` (seconds). The whole display
re-scales automatically.
