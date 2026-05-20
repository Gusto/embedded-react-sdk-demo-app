import "@gusto/embedded-react-sdk/style.css";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./shell/AppShell";
import { AdapterProvider } from "./sdk/adapterContext";
import { ThemeProvider } from "./sdk/themeContext";
import { ToastProvider } from "./toast/ToastProvider";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AdapterProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </AdapterProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
