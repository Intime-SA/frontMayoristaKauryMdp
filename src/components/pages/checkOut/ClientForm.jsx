import React, { useContext, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { db } from "../../../firebaseConfig";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ClientForm = ({
  customers,
  setOpenForm,
  setDataCliente,
  andreaniCostoDomicilio,
  andreaniAsucursal,
  setDesabilitarEnvio,
  fromPago,
}) => {
  const [customerData, setCustomerData] = useState({});
  const [newDataEnvio, setNewDataEnvio] = useState({
    datosEnvio: {
      calle: "",
      numero: "",
      pisoDpto: "",
      codigoPostal: "",
      barrio: "",
      ciudad: "",
      provincia: "",
    },
  });
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userData, setUserData] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("esto es fromPago: " + fromPago);

  useEffect(() => {
    const fetchData = async () => {
      if (!user.email) {
        navigate("/login");
      } else {
        const foundCustomer = customers.find(
          (customer) => customer.data().email === user.email
        );
        setCustomerData(foundCustomer);
        console.log(foundCustomer);

        if (foundCustomer && foundCustomer.datosEnvio) {
          setNewDataEnvio(foundCustomer.datosEnvio);
        }

        if (foundCustomer && foundCustomer.telefono) {
          setTelefono(foundCustomer.telefono);
        }
      }
    };

    fetchData();
  }, [user, customers]); // Agregamos user y customers como dependencias para asegurar que se ejecute cuando estos cambien

  const userOrderJSON = localStorage.getItem("userOrder");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si customerData está definido y no es nulo
    if (!customerData || !customerData.id) {
      console.error("No se pudo encontrar el cliente o su ID está indefinido.");
      return;
    }

    // Verificar y corregir la estructura de newDataEnvio si es necesario
    const newDataEnvioCorrected = {
      datosEnvio: {
        calle: newDataEnvio.datosEnvio.calle || "",
        numero: newDataEnvio.datosEnvio.numero || "",
        pisoDpto: newDataEnvio.datosEnvio.pisoDpto || "",
        codigoPostal: newDataEnvio.datosEnvio.codigoPostal || "",
        barrio: newDataEnvio.datosEnvio.barrio || "",
        ciudad: newDataEnvio.datosEnvio.ciudad || "",
        provincia: newDataEnvio.datosEnvio.provincia || "",
      },
    };

    try {
      // Actualizar datos de envío y teléfono del cliente existente

      // Actualizar datos en la base de datos
      const userRef = doc(db, "users", customerData.id);

      await updateDoc(userRef, {
        datosEnvio: newDataEnvioCorrected.datosEnvio, // Actualizamos datos de envío
        telefono: telefono,
        dni: dni, // Agregamos o actualizamos el teléfono
      });

      setUpdateSuccess(true); // Actualización exitosa
      setOpenForm(false);

      const obtenerRutaCliente = (idCliente) => {
        return `users/${idCliente}`;
      };

      const clienteRef = doc(db, obtenerRutaCliente(customerData.id));
      console.log(clienteRef);
      // Verificar si hay un objeto almacenado
      if (userOrderJSON) {
        // Parsear la cadena JSON de vuelta a un objeto JavaScript
        const userOrder = JSON.parse(userOrderJSON);
        console.log(userOrder);

        // Agregar propiedades adicionales al objeto userOrder
        userOrder.client = clienteRef;
        userOrder.clienteId = customerData.id; // Usamos el ID del cliente
        userOrder.infoEntrega = newDataEnvioCorrected.datosEnvio;
        userOrder.telefono = telefono;

        if (
          userOrder.tipoEnvio === 1 &&
          userOrder.envioSeleccionado === "envioDomicilio"
        ) {
          userOrder.total = userOrder.total + andreaniCostoDomicilio;
        } else if (
          userOrder.tipoEnvio === 1 &&
          userOrder.envioSeleccionado === "envioSucursal"
        ) {
          userOrder.total = userOrder.total + andreaniAsucursal;
        }

        // Volver a convertir el objeto a una cadena JSON
        const userOrderActualizadoJSON = JSON.stringify(userOrder);

        // Actualizar el objeto en localStorage
        localStorage.setItem("userOrder", userOrderActualizadoJSON);
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      setUpdateSuccess(false); // Actualización fallida
    }

    setDesabilitarEnvio(true);
    window.scrollTo(0, 0); // Desplazar al principio de la página
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (updateSuccess) {
        try {
          const userRef = doc(db, "users", customerData.id);
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setDataCliente(userData);
            // Guardar los datos del documento en un estado
            setUserData(userData);
            console.log(userData);
            // Llamar a setDataCliente después de actualizar userData
          } else {
            // Manejar el caso cuando el documento no existe
            console.log("El documento no existe");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, [updateSuccess]);

  return (
    <div style={{ width: "auto", zoom: "0.9" }}>
      {updateSuccess && userData ? (
        <div>{userData && <div></div>}</div>
      ) : (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            width: "auto",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {user && (
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  width: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h5
                  style={{
                    marginTop: "0rem",
                    marginBottom: "2rem",
                    marginLeft: "1rem",
                  }}
                >
                  <strong style={{ fontFamily: '"Kanit", sans-serif' }}>
                    Datos de destinatario
                  </strong>
                </h5>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <TextField
                    name="email"
                    variant="outlined"
                    label="Correo electrónico"
                    value={user.email}
                    fullWidth
                    style={{
                      marginBottom: "1rem",
                      width: "100%",
                    }}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <TextField
                    name="telefono"
                    variant="outlined"
                    label="Teléfono"
                    value={telefono}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Validate and allow only numeric characters for phone number
                      if (!/^\d*$/.test(inputValue)) {
                        setErrorTelefono(
                          "El formato del teléfono es incorrecto"
                        );
                      } else {
                        setErrorTelefono(""); // Restablecer el error a una cadena vacía si el formato es correcto
                        setTelefono(inputValue); // Actualizar el estado del teléfono si el formato es correcto
                      }
                    }}
                    fullWidth
                    required
                    style={{
                      marginBottom: "1rem",
                      width: "100%",

                      fontFamily: '"Kanit", sans-serif',
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={errorTelefono !== ""}
                    helperText={errorTelefono}
                  />
                  <TextField
                    name="dni"
                    variant="outlined"
                    label="DNI/CUIT"
                    value={dni}
                    onChange={(e) => {
                      setDni(e.target.value);
                    }}
                    fullWidth
                    required
                    style={{
                      marginBottom: "1rem",
                      width: "100%",

                      fontFamily: '"Kanit", sans-serif',
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            )}

            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              <h5
                style={{
                  marginTop: "0rem",
                  marginBottom: "2rem",
                  marginLeft: "1rem",
                  fontFamily: '"Kanit", sans-serif',
                }}
              >
                <strong style={{ fontFamily: '"Kanit", sans-serif' }}>
                  Datos de Envío / Facturacion{" "}
                </strong>
              </h5>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <TextField
                  name="datosEnvio.calle"
                  variant="outlined"
                  label="Calle"
                  value={newDataEnvio.datosEnvio.calle}
                  onChange={(e) =>
                    setNewDataEnvio({
                      ...newDataEnvio,
                      datosEnvio: {
                        ...newDataEnvio.datosEnvio,
                        calle: e.target.value,
                      },
                    })
                  }
                  required
                  fullWidth
                  style={{
                    marginBottom: "1rem",
                    width: "100%",
                  }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  name="datosEnvio.numero"
                  variant="outlined"
                  label="Número"
                  value={newDataEnvio.datosEnvio.numero}
                  onChange={(e) =>
                    setNewDataEnvio({
                      ...newDataEnvio,
                      datosEnvio: {
                        ...newDataEnvio.datosEnvio,
                        numero: e.target.value,
                      },
                    })
                  }
                  required
                  fullWidth
                  style={{
                    marginBottom: "1rem",
                    width: "100%",
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="datosEnvio.pisoDpto"
                  variant="outlined"
                  label="Piso/Dpto"
                  value={newDataEnvio.datosEnvio.pisoDpto}
                  onChange={(e) =>
                    setNewDataEnvio({
                      ...newDataEnvio,
                      datosEnvio: {
                        ...newDataEnvio.datosEnvio,
                        pisoDpto: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  style={{
                    marginBottom: "1rem",
                    width: "100%",

                    fontFamily: '"Kanit", sans-serif',
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="datosEnvio.codigoPostal"
                  variant="outlined"
                  label="Código Postal"
                  value={newDataEnvio.datosEnvio.codigoPostal}
                  onChange={(e) =>
                    setNewDataEnvio({
                      ...newDataEnvio,
                      datosEnvio: {
                        ...newDataEnvio.datosEnvio,
                        codigoPostal: e.target.value,
                      },
                    })
                  }
                  required
                  fullWidth
                  style={{
                    marginBottom: "1rem",
                    width: "100%",

                    fontFamily: '"Kanit", sans-serif',
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="datosEnvio.barrio"
                  variant="outlined"
                  label="Barrio"
                  value={newDataEnvio.datosEnvio.barrio}
                  onChange={(e) =>
                    setNewDataEnvio({
                      ...newDataEnvio,
                      datosEnvio: {
                        ...newDataEnvio.datosEnvio,
                        barrio: e.target.value,
                      },
                    })
                  }
                  fullWidth
                  style={{
                    marginBottom: "1rem",
                    width: "100%",

                    fontFamily: '"Kanit", sans-serif',
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="datosEnvio.ciudad"
                  variant="outlined"
                  label="Ciudad"
                  value={newDataEnvio.datosEnvio.ciudad}
                  onChange={(e) =>
                    setNewDataEnvio({
                      ...newDataEnvio,
                      datosEnvio: {
                        ...newDataEnvio.datosEnvio,
                        ciudad: e.target.value,
                      },
                    })
                  }
                  required
                  fullWidth
                  style={{
                    marginBottom: "1rem",
                    width: "100%",

                    fontFamily: '"Kanit", sans-serif',
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="datosEnvio.provincia"
                  variant="outlined"
                  label="Provincia"
                  value={newDataEnvio.datosEnvio.provincia}
                  onChange={(e) =>
                    setNewDataEnvio({
                      ...newDataEnvio,
                      datosEnvio: {
                        ...newDataEnvio.datosEnvio,
                        provincia: e.target.value,
                      },
                    })
                  }
                  required
                  fullWidth
                  style={{
                    marginBottom: "1rem",
                    width: "100%",

                    fontFamily: '"Kanit", sans-serif',
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* Resto de los campos de datos de envío */}
              </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                marginBottom: "1rem",
                width: "100%",

                fontFamily: '"Kanit", sans-serif',
              }}
            >
              Confirmar Datos
            </Button>
          </form>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
    </div>
  );
};

export default ClientForm;
