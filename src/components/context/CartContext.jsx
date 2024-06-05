import React, { useState, useEffect } from "react";
import { createContext } from "react";

export const CartContext = createContext();

const CartContextComponente = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const addToCart = (product) => {
    const timestamp = new Date().getTime(); // Obtener el timestamp actual

    let existe = cart.some((e) => e.idc === product.idc);

    if (existe) {
      let newArr = cart.map((elemento) => {
        if (elemento.idc === product.idc) {
          return { ...elemento, quantity: product.quantity, timestamp }; // Añadir timestamp
        } else {
          return elemento;
        }
      });
      localStorage.setItem("cart", JSON.stringify(newArr));
      setCart(newArr);
      console.log(cart);
    } else {
      const updatedCart = [...cart, { ...product, timestamp }]; // Añadir timestamp
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
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

  // Función loadOrder para verificar y eliminar pedidos expirados
  const loadOrder = () => {
    const data = JSON.parse(localStorage.getItem("cart"));
    if (data) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - data[0].timestamp;

      const hoursDifference = timeDifference / (1000 * 60 * 60);
      console.log("horas difference" + hoursDifference);

      if (hoursDifference >= 24) {
        clearCart();
        console.log(hoursDifference);
        return null; // El pedido ha expirado
      }
      return data; // Devuelve el pedido si no ha expirado
    }
    return null; // No hay pedido guardado
  };

  // useEffect para cargar y verificar el pedido al montar el componente

  loadOrder();

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
