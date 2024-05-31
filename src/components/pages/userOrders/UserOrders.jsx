import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import {
  Timestamp,
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import UserOrdersDetail from "./UserOrdersDetail";
import Typography from "@mui/material/Typography";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [ordersPerPage] = useState(7); // Cantidad de órdenes por página
  const [filterDate, setFilterDate] = useState(""); // Estado para almacenar la fecha de filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [orderFilters, setOrdersFilters] = useState([]);
  const [ordersLength, setOrdersLength] = useState(0);
  const [archivada, setArchivada] = useState(false);

  useEffect(() => {
    // Esperar a que orders tenga datos
    if (orders.length > 0) {
      setOrdersFilters(orders);
    }
  }, [orders]);

  useEffect(() => {
    const recorrerOrders = () => {
      let newArrayLength = [];
      orders.forEach((element) => {
        if (element.status !== "archivada") {
          newArrayLength.push(element);
        }
      });
      setOrdersLength(newArrayLength.length);
    };

    recorrerOrders();
  }, [orders, archivada]);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Obtén el email del localStorage
      const userEmail = JSON.parse(localStorage.getItem("userInfo"))?.email;

      if (userEmail) {
        // Referencia a la colección
        const refCollection = collection(db, "users");

        // Crear la consulta
        const q = query(refCollection, where("email", "==", userEmail));

        // Ejecutar la consulta
        const querySnapshot = await getDocs(q);

        // Manejar los resultados
        if (!querySnapshot.empty) {
          // Se asume que solo habrá un documento que coincida con el email
          const userDoc = querySnapshot.docs[0];
          const userDataWithId = { id: userDoc.id, ...userDoc.data() };
          setUserData(userDataWithId);
        } else {
          console.log("No user found with the given email.");
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (userData && userData.id) {
        let refCollection = collection(db, "userOrders");
        let queryRef = query(
          refCollection,
          where("clienteId", "==", userData.id)
        );

        // Si filterDate está vacío o no es una fecha válida, obtener todas las órdenes
        if (filterDate && !isNaN(new Date(filterDate).getTime())) {
          const selectedDate = new Date(filterDate);
          const selectedDateOnly = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          );

          queryRef = query(
            queryRef,
            where("date", ">=", Timestamp.fromDate(selectedDateOnly)),
            where(
              "date",
              "<",
              Timestamp.fromDate(
                new Date(selectedDateOnly.getTime() + 24 * 60 * 60 * 1000)
              )
            )
          );
        }

        try {
          const querySnapshot = await getDocs(queryRef);
          let newArray = [];
          querySnapshot.forEach((doc) => {
            const orderData = doc.data();
            newArray.push({ ...orderData, id: doc.id });
          });

          // Ordenar los pedidos por fecha de más reciente a más antiguo
          newArray.sort((a, b) => {
            const dateA = new Date(a.date.seconds * 1000);
            const dateB = new Date(b.date.seconds * 1000);
            return dateB - dateA;
          });

          setOrders(newArray);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchOrders();
  }, [userData, filterDate, archivada, openForm, changeStatus]);

  // Calcular índices del primer y último pedido en la página actual
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders =
    orderFilters.length > 0
      ? orderFilters.slice(indexOfFirstOrder, indexOfLastOrder)
      : orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para manejar el cambio en el TextField de fecha
  const handleDateChange = (event) => {
    setFilterDate(event.target.value);
    console.log(event.target.value);
  };

  const [event, setEvent] = useState(null);
  const [cambio, setCambio] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedSearchTerm = localStorage.getItem("searchTerm");
      if (storedSearchTerm !== null) {
        handleSearch(event);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [changeStatus, event, cambio]); // Agrega event como dependencia

  const handleSearch = async (e) => {
    try {
      // Guardar el evento y el término de búsqueda en el estado
      setEvent(e);
      const searchTerm = e.target.value;
      setSearchTerm(searchTerm);

      // Convertir el término de búsqueda a un número
      const searchTermNumber = parseInt(searchTerm);

      // Guardar el término de búsqueda en localStorage
      localStorage.setItem("searchTerm", searchTerm);

      // Obtener los datos de las órdenes de Firestore
      const querySnapshot = await getDocs(collection(db, "userOrders"));

      // Convertir los documentos en un array de órdenes
      const newArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Filtrar las órdenes según el término de búsqueda
      const filteredOrder = newArray.filter(
        (order) => order.numberOrder === searchTermNumber
      );

      // Establecer las órdenes filtradas como el nuevo estado
      setOrdersFilters(filteredOrder);
    } catch (error) {
      console.error("Error al buscar y filtrar las órdenes:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "column",

        fontSize: "2rem",
        position: "relative",
        width: "95vw",
      }}
    >
      <div style={{ width: "100%", height: "auto" }}>
        <UserOrdersDetail
          orders={currentOrders}
          setChangeStatus={setChangeStatus}
          changeStatus={changeStatus}
          openForm={openForm}
          ordersLenght={orders.length}
          setCambio={setCambio}
          currentPage={currentPage}
        />
      </div>
      <Box
        mt={2}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Botones de paginación */}
        <Typography component="span" variant="body2" color="text.primary">
          Ordenes Activas: <strong>{ordersLength}</strong>
        </Typography>

        <div>
          <Button
            variant="contained"
            color="inherit"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
            style={{ margin: "1rem" }}
          >
            <span class="material-symbols-outlined">navigate_before</span>
          </Button>

          <Button
            variant="contained"
            onClick={() => paginate(currentPage + 1)}
            style={{ margin: "1rem" }}
          >
            <span class="material-symbols-outlined">navigate_next</span>
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default UserOrders;
