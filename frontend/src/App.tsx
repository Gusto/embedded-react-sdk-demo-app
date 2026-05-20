import { GustoProvider } from "@gusto/embedded-react-sdk";
import "@gusto/embedded-react-sdk/style.css";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./shell/AppShell";
import "./App.css";

function App() {
  return (
    <GustoProvider config={{ baseUrl: "http://localhost:3001" }}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </GustoProvider>
  );
}

export default App;
