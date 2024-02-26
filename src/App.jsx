import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { GlobalStateProvider } from "./components/context/Context";
import AuthContextComponent from "./components/context/AuthContext";

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <AuthContextComponent>
          <AppRouter />
        </AuthContextComponent>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
