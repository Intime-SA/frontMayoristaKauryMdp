import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { db, loginGoogle, onSingIn } from "../../../firebaseConfig";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useContext, useState } from "react";

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  console.log(userCredentials);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await onSingIn(userCredentials); // Asumo que tienes una función onSignIn para el inicio de sesión
      if (res.user) {
        const userCollection = collection(db, "users");
        const userRef = doc(userCollection, res.user.uid);
        console.log(res.user);
        const userDoc = await getDoc(userRef);
        let finalyUser = {
          email: res.user.email,
          rol: userDoc.data().roll,
        }; // Obtén los datos del documento
        console.log(finalyUser);
        handleLogin(finalyUser);
        navigate("/"); // Asumo que tienes una función navigate para redirigir al usuario

        // No necesitas el 'return getDoc(userDoc);' ya que no parece necesario aquí
      }
    } catch (error) {
      alert(
        "Las credenciales ingresadas no son validas. Por favor, comuniquese con el administrador. \n\n Email: ramiro@desarrollostech.com \n Tel: +54 9 11 6870-2318"
      );
      console.log(error);
    }
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const googleSingIn = async () => {
    try {
      const res = await loginGoogle();

      if (res.user) {
        const userCollection = collection(db, "users");
        const userRef = doc(userCollection, res.user.uid);

        const userDoc = await getDoc(userRef);
        console.log(userDoc);

        if (!userDoc.exists()) {
          const fullName = res.user.displayName;
          const [firstName, lastName] = fullName.split(" ");
          const currentDate = new Date(); // Capturar la fecha actual
          const date = formatDate(currentDate);
          console.log(date);
          const userData = {
            nombre: firstName,
            apellido: lastName,
            email: res.user.email,
            roll: "customer",
            fechaInicio: date,
          };
          console.log(userData);

          await setDoc(userRef, userData);
        }

        const finalyUser = {
          email: res.user.email,
          rol: "customer",
        };
        handleLogin(finalyUser);
        navigate("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      // Manejo de errores, por ejemplo, mostrar un mensaje de error al usuario
    }
  };

  return (
    <Box
      sx={{
        width: "100",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "15%",
        // backgroundColor: theme.palette.secondary.main,
      }}
    >
      <img src="https://www.kaury.com/img/kaury_logo_19.svg" alt="logo" />
      <form onSubmit={handleSubmit}>
        <Grid
          container
          rowSpacing={2}
          // alignItems="center"
          justifyContent={"center"}
        >
          <Grid item xs={10} md={12}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Contraseña
              </InputLabel>
              <OutlinedInput
                onChange={handleChange}
                name="password"
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff color="primary" />
                      ) : (
                        <Visibility color="primary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
              />
            </FormControl>
          </Grid>
          <Link
            to="/forgot-password"
            style={{ color: "steelblue", marginTop: "10px" }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Grid container justifyContent="center" spacing={3} mt={2}>
            <Grid item xs={10} md={5}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  backgroundColor: "#c4072c",
                  color: "white",
                  textTransform: "none",
                  textShadow: "2px 2px 2px grey",
                }}
              >
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={10} md={5}>
              <Tooltip title="ingresa con google">
                <Button
                  onClick={googleSingIn}
                  variant="contained"
                  startIcon={<GoogleIcon />}
                  type="button"
                  fullWidth
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                  }}
                >
                  Ingresa con google
                </Button>
              </Tooltip>
            </Grid>

            <Grid item xs={10} md={8}>
              <Typography
                color={"secondary.primary"}
                variant={"h6"}
                mt={1}
                align="center"
              >
                ¿Aun no tienes cuenta?
              </Typography>
            </Grid>
            <Grid item xs={10} md={5}>
              <Tooltip title="ingresa con google">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/register")}
                  type="button"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                  }}
                >
                  Registrate
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Login;
