import "@gusto/embedded-react-sdk/style.css";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./shell/AppShell";
import { AdapterProvider } from "./sdk/adapterContext";
import { ThemeProvider } from "./sdk/themeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AdapterProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AdapterProvider>
    </ThemeProvider>
  );
}

export default App;
