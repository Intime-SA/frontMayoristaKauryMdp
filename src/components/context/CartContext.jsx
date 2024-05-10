import React, { useState } from "react";
import { createContext } from "react";

export const CartContext = createContext();

const CartContextComponente = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const addToCart = (product) => {
    let existe = cart.some((e) => e.idc === product.idc);

    if (existe) {
      let newArr = cart.map((elemento) => {
        if (elemento.idc === product.idc) {
          return { ...elemento, quantity: product.quantity };
        } else {
          return elemento;
        }
      });
      localStorage.setItem("cart", JSON.stringify(newArr));
      setCart(newArr);
      console.log(cart);
    } else {
      localStorage.setItem("cart", JSON.stringify([...cart, product]));
      setCart([...cart, product]);
    }
  };

  const getQuantityById = (id) => {
    let product = cart.find((elemento) => elemento.id === id);
    return product?.quantity;
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const deleteById = (id) => {
    const newArr = cart.filter((elemento) => elemento.idc !== id);
    localStorage.setItem("cart", JSON.stringify(newArr));
    setCart(newArr);
  };

  const getTotalPrice = () => {
    const total = cart.reduce((acc, elemento) => {
      return acc + elemento.unit_price * elemento.quantity;
    }, 0);
    return total;
  };

  const [regresoDePago, setRegresoDePago] = useState(false);

  let data = {
    cart,
    addToCart,
    getQuantityById,
    clearCart,
    deleteById,
    getTotalPrice,
    setRegresoDePago,
    regresoDePago,
  };

  return <CartContext.Provider value={data}>{children}</CartContext.Provider>;
};

export default CartContextComponente;
