import "@gusto/embedded-react-sdk/style.css";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./shell/AppShell";
import { AdapterProvider } from "./sdk/adapterContext";
import "./App.css";

function App() {
  return (
    <AdapterProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AdapterProvider>
  );
}

export default App;
