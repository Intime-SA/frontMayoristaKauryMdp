import React, { useState } from "react";
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
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signUp, db } from "../../../firebaseConfig";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "@mui/material/styles";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    apellido: "",
    numeroTelefono: "",
  });
  const [passwordError, setPasswordError] = useState(false);

  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, apellido, telefono, confirmPassword } =
      userCredentials;

    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    }

    try {
      const res = await signUp({ email, password });
      if (res.user.uid) {
        const userDoc = {
          email: res.user.email,
          roll: "customer",
          name,
          apellido,
          telefono,
          fechaInicio: serverTimestamp(),
        };
        await setDoc(doc(db, "users", res.user.uid), userDoc);
      }
      navigate("/login");
    } catch (error) {
      // Manejo de errores de Firebase
      console.error("Error al registrarse:", error.message);
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        src="https://www.kaury.com/img/kaury_logo_19.svg"
        alt="logo"
        style={{ width: isNarrowScreen ? "50%" : "auto" }}
      />
      <h1
        style={{
          color: "#c4072c",
          marginTop: "1%",
          fontSize: "100%",
          color: "#c4072c",
          fontWeight: 250,
        }}
      >
        Mayorista
      </h1>
      <h2
        style={{
          color: "#c4072c",
          marginTop: "1%",
          fontSize: "100%",
          color: "#c4072c",
          fontWeight: 250,
        }}
      >
        Mar del Plata
      </h2>
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2} justifyContent="center">
          <Grid item xs={10} md={12}>
            <TextField
              onChange={handleChange}
              name="name"
              label="Nombre"
              fullWidth
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <TextField
              onChange={handleChange}
              name="apellido"
              label="Apellido"
              fullWidth
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <TextField
              onChange={handleChange}
              name="telefono"
              label="Número de Teléfono"
              fullWidth
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <TextField
              onChange={handleChange}
              name="email"
              label="Email"
              fullWidth
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <FormControl variant="outlined" fullWidth error={passwordError}>
              <InputLabel htmlFor="outlined-adornment-password">
                Contraseña
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
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
          <Grid item xs={10} md={12}>
            <FormControl variant="outlined" fullWidth error={passwordError}>
              <InputLabel htmlFor="outlined-adornment-password">
                Confirmar contraseña
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                onChange={handleChange}
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
                label="Confirmar contraseña"
              />
            </FormControl>
          </Grid>
          {passwordError && (
            <Grid item xs={10} md={12}>
              <p style={{ color: "red" }}>Las contraseñas no coinciden.</p>
            </Grid>
          )}
          <Grid container justifyContent="center" spacing={3} mt={2}>
            <Grid item xs={10} md={7}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                type="submit"
                sx={{
                  color: "white",
                  textTransform: "none",
                  textShadow: "2px 2px 2px grey",
                }}
              >
                REGISTRAR
              </Button>
            </Grid>
            <Grid item xs={10} md={7}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
                type="button"
              >
                REGRESAR
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Register;
