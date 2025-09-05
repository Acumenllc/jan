use tauri::{generate_context, Builder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .plugin(tauri_plugin_os::init())
        .run(generate_context!())
        .expect("error while running tauri application");
}