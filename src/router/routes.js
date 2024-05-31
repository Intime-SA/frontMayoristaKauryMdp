import CheckOut from "../components/pages/checkOut/CheckOut";
import Pago from "../components/pages/checkOut/Pago";
import Home from "../components/pages/home/Home";
import ListArticles from "../components/pages/home/cards/ListArticles";
import Cart from "../components/pages/home/cart/Cart";
import ViewProduct from "../components/pages/home/viewProduct/ViewProduct";
import Compras from "../components/pages/userOrders/Compras";

export const routes = [
  {
    id: "home",
    path: "/",
    Element: Home,
  },
  {
    id: "cart",
    path: "/cart",
    Element: Cart,
  },
  {
    id: "checkout",
    path: "/checkout",
    Element: CheckOut,
  },
  {
    id: "viewProduct",
    path: "/viewProduct/:id",
    Element: ViewProduct,
  },
  {
    id: "listArticles",
    path: "/listArticles/:id",
    Element: ListArticles,
  },
  {
    id: "pago",
    path: "/pago",
    Element: Pago,
  },
  {
    id: "compras",
    path: "/compras",
    Element: Compras,
  },
];
