
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set default theme from localStorage or use dark as default
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.classList.add(savedTheme);

createRoot(document.getElementById("root")!).render(<App />);
