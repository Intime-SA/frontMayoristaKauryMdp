import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.css";
import ListCards from "./cards/ListCards";
import ListOferta from "./cards/ListOferta";
import { Typography } from "@mui/material";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Hace scroll al tope de la página
  }, []);

  const Carousel = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div
        style={{
          width: "100vw",
          paddingLeft: "0px",
          paddingRight: "0px",
          margin: "0",
        }}
      >
        {" "}
        {/* Ajusta el ancho según tu diseño */}
        <Slider {...settings}>
          <div>
            <div
              style={{
                background: "rgba(175, 155, 144, 0.21)",
                height: "20vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "50%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    border: "1px solid black",
                    borderRadius: "50px",
                    width: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "auto",
                  }}
                >
                  <div
                    style={{
                      width: "5rem",
                      height: "5rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{ width: "2.5rem" }}
                      src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/whatsapp.svg?alt=media&token=83bb48a7-7405-4a69-867c-44568a7e108f"
                      alt=""
                    />
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    fontSize: "50%",
                  }}
                >
                  <p style={{ margin: "0px" }}>
                    <strong>WHATSAPP</strong>
                  </p>
                  <p
                    style={{
                      margin: "0px",
                      fontFamily: '"Kanit", sans-serif',
                    }}
                  >
                    Si queres revender nuestros productos, no dudes en
                    contactarte con nosotros.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                background: "rgba(175, 155, 144, 0.21)",
                height: "20vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "50%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    border: "1px solid black",
                    borderRadius: "50px",
                    width: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "auto%",
                  }}
                >
                  <div
                    style={{
                      width: "5rem",
                      height: "5rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{ fontSize: "120%" }}
                      className="material-symbols-outlined"
                    >
                      credit_card
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    fontSize: "50%",
                    fontFamily: '"Kanit", sans-serif',
                  }}
                >
                  <p style={{ margin: "0px" }}>
                    <strong>Tarjetas de credito y debito</strong>
                  </p>
                  <p
                    style={{ margin: "0px", fontFamily: '"Kanit", sans-serif' }}
                  >
                    Podes abonar con tarjeta de credito y debito. Compra 100%
                    segura
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                background: "rgba(175, 155, 144, 0.21)",
                height: "20vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "50%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    border: "1px solid black",
                    borderRadius: "50px",
                    width: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "auto%",
                  }}
                >
                  <div
                    style={{
                      width: "5rem",
                      height: "5rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{ fontSize: "120%" }}
                      className="material-symbols-outlined"
                    >
                      local_shipping
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    fontSize: "50%",
                  }}
                >
                  <p
                    style={{ margin: "0px", fontFamily: '"Kanit", sans-serif' }}
                  >
                    <strong>Envio para todo el pais</strong>
                  </p>
                  <p
                    style={{ margin: "0px", fontFamily: '"Kanit", sans-serif' }}
                  >
                    Enviamos tu producto KAURY por andreani o correo argentino
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                background: "rgba(175, 155, 144, 0.21)",
                height: "20vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "50%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    border: "1px solid black",
                    borderRadius: "50px",
                    width: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "auto%",
                  }}
                >
                  <div
                    style={{
                      width: "5rem",
                      height: "5rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{ fontSize: "120%" }}
                      className="material-symbols-outlined"
                    >
                      home
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    fontSize: "50%",
                  }}
                >
                  <p
                    style={{ margin: "0px", fontFamily: '"Kanit", sans-serif' }}
                  >
                    <strong>Quedate en casa</strong>
                  </p>
                  <p
                    style={{ margin: "0px", fontFamily: '"Kanit", sans-serif' }}
                  >
                    Te llevamos tu producto sin que salgas de tu casa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: "2rem",
        position: "relative",
        width: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      <Carousel />
      <ListCards />

      <Typography
        variant="h4"
        style={{
          fontFamily: '"Kanit", sans-serif',
          fontWeight: 900,
          marginBottom: "1rem",
          color: "#c4072c",
        }}
      >
        OFERTAS
      </Typography>
      <div
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ListOferta />
      </div>
    </div>
  );
};

export default Home;
