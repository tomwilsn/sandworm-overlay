use tauri::{Emitter, Manager, PhysicalPosition};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Ctrl+Alt combos — chosen to avoid clashing with macOS system shortcuts.
    // Hold this one to drag the window with the mouse; release to re-lock.
    let hold_drag = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::KeyD);
    let switch_mode = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::KeyM);
    let quit_app = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::KeyX);

    // Clones captured by the shortcut handler closure.
    let h_drag = hold_drag.clone();
    let h_switch = switch_mode.clone();
    let h_quit = quit_app.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(move |app, shortcut, event| {
                    let Some(win) = app.get_webview_window("main") else {
                        return;
                    };

                    // Hold-to-drag: react to BOTH press and release.
                    if shortcut == &h_drag {
                        match event.state() {
                            ShortcutState::Pressed => {
                                // become interactive so the drag layer can grab the cursor
                                let _ = win.set_ignore_cursor_events(false);
                                let _ = win.emit("dragmode", true);
                            }
                            ShortcutState::Released => {
                                // back to a pure click-through overlay
                                let _ = win.set_ignore_cursor_events(true);
                                let _ = win.emit("dragmode", false);
                            }
                        }
                        return;
                    }

                    // Everything else fires once, on press.
                    if event.state() != ShortcutState::Pressed {
                        return;
                    }
                    if shortcut == &h_switch {
                        let _ = win.emit("switch-mode", ());
                    } else if shortcut == &h_quit {
                        app.exit(0);
                    }
                })
                .build(),
        )
        .setup(move |app| {
            let win = app.get_webview_window("main").unwrap();

            // Start as a pure click-through overlay.
            let _ = win.set_ignore_cursor_events(true);

            // Park it in the top-right corner of the primary monitor.
            if let Ok(Some(monitor)) = win.primary_monitor() {
                let msize = monitor.size();
                if let Ok(wsize) = win.outer_size() {
                    let x = msize.width as i32 - wsize.width as i32 - 24;
                    let y = 48;
                    let _ = win.set_position(PhysicalPosition::new(x, y));
                }
            }

            // Register the global shortcuts.
            let gs = app.global_shortcut();
            gs.register(hold_drag.clone())?;
            gs.register(switch_mode.clone())?;
            gs.register(quit_app.clone())?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
