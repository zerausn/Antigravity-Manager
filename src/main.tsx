import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import './i18n'; // Import i18n config
import "./App.css";

import { isTauri } from "./utils/env";

// ============================================================================
// [FIX] BLOCK GLOBAL THEME TOGGLE (ARROW KEY ERRORS)
// ============================================================================
// Some third-party components (LobeHub UI/AntD) or system-level listeners 
// might intercept 'ArrowRight' or 'ArrowLeft' to toggle the theme. 
// This block ensures that we catch and kill the event before it propagates.
// ============================================================================
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      // Check if the user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;
      
      // If NOT in an input, block the event from triggering global theme switches
      if (!isInput) {
        console.warn(`[FIX] Blocked global ${e.key} event to prevent unwanted theme toggle.`);
        e.stopImmediatePropagation();
        e.stopPropagation();
      }
    }
  }, { capture: true }); // Use capture phase to intercept early
}

// 启动时显式调用 Rust 命令显示窗口
// 配合 visible:false 使用，解决启动黑屏问题
if (isTauri()) {
  import("@tauri-apps/api/core").then(({ invoke }) => {
    invoke("show_main_window").catch(console.error);
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />

  </React.StrictMode>,
);
