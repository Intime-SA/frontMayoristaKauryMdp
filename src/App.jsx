import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { GlobalStateProvider } from "./components/context/Context";
import AuthContextComponent from "./components/context/AuthContext";
import CartContextComponente from "./components/context/CartContext";

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <AuthContextComponent>
          <CartContextComponente>
            <AppRouter />
          </CartContextComponente>
        </AuthContextComponent>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
