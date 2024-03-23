import React from "react";

const CheckoutScreen = ({ order }) => {
  console.log(order);
  return (
    <div>
      {/* <h2>Detalles de la Orden</h2>
      <p>Canal de Venta: {order.canalVenta}</p>
      {/*       <p>Cliente: {order.client.id}</p> */}
      {/*       <p>Fecha: {order.date}</p>
      <p>Último Estado: {order.lastState}</p>
      <p>Nota: {order.note}</p>
      <p>Número de Orden: {order.numberOrder}</p>
      <p>Status: {order.status}</p>
      <p>Total: {order.total}</p>
      <h3>Información de Entrega:</h3>
      {/* <ul>
        {order.infoEntrega.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul> */}
      {/* <h3>Items de la Orden:</h3>
      {order.orderItems.map((item, index) => (
        <div key={index}>
          <p>Producto #{index + 1}</p>
          <p>Color: {item.color}</p>
          <p>Descuento: {item.descuento}</p>
          <img src={item.image} alt={item.name} style={{ maxWidth: "100px" }} />
          <p>Nombre: {item.name}</p>
          <p>ID del Producto: {item.productId}</p>
          <p>Cantidad: {item.quantity}</p>
          <p>Subtotal: {item.subtotal}</p>
          <p>Talle: {item.talle}</p>
          <p>Precio Unitario: {item.unit_price}</p>
        </div> */}
    </div>
  );
};

export default CheckoutScreen;
