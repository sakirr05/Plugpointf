/**
 * --- THE ENGINE START ---
 * This is the very first file that runs when someone opens 
 * the website. It "Initializes" our React app and injects 
 * it into the main HTML file.
 */

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// 1. Find the <div id="root"> element in index.html
const rootElement = document.getElementById("root");

if (rootElement) {
  // 2. Wrap our whole <App /> in the React engine and 
  // draw it onto the screen!
  createRoot(rootElement).render(<App />);
}