import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import loader from "./assets/loader.gif";
import {
  Box,
  Spinner,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
const regexPattern = /[^A-Za-z]/g;

function App() {
  const [res, setRes] = useState();
  const [images, setImages] = useState(
    importAll(require.context("./assets", false, /\.(png|jpe?g|svg)$/))
  );

  useEffect(() => {
    const getSidereal = async () => {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const sidereal = await axios.get(
        `https://astrapredict.onrender.com/astro/sidereal`,
        {
          params: {
            city: data.city,
            region: data.region,
            ip: data.ip,
            country: data.country,
            time: new Date().toLocaleString(),
          },
        }
      );
      setRes(sidereal);
    };
    getSidereal();
  }, []);

  function importAll(r) {
    let imgs = {};
    r.keys().forEach((item, index) => {
      imgs[item.replace("./", "")] = r(item);
    });
    return imgs;
  }

  function getImage() {
    return images[
      `${res.data.planets[0].longitude
        .replace(regexPattern, "")
        .toLowerCase()}${getRandomInt(4)}.png`
    ];
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  return (
    <div className="App-header">
      {res ? (
        <SimpleGrid minChildWidth="400px" columns={2} spacing={4}>
          <Box rowSpan={6} colSpan={6}>
            {res && (
              <center>
                <br />
                <h3>
                  <strong style={{ color: "#FCB13B" }}>
                    {res?.data.location.city}, {res?.data.location.region}
                  </strong>
                  <br />
                  <small>{res?.data.location.time}</small>
                </h3>
                <br />
                <div style={{ justifyContent: "space-between" }}>
                  {images ? (
                    <img
                      style={{ borderRadius: "50%", maxWidth: "50%" }}
                      src={getImage()}
                      alt="image not found"
                    ></img>
                  ) : (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="yellow.400"
                      color="yellow.600"
                      size="xl"
                    />
                  )}
                </div>
                <br />
                <h4
                  style={{
                    color: "#FF6630",
                    fontWeight: "bold",
                  }}
                >
                  {res?.data.planets[0].planet.toUpperCase()}:{" "}
                  {res?.data.planets[0].longitude}
                </h4>
              </center>
            )}
          </Box>
          <Box colSpan={6}>
            <center>
              <TableContainer>
                <Table>
                  <TableCaption style={{ color: "white" }}>
                    Planet Positions
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th style={{ color: "white" }}>Planets</Th>
                      <Th style={{ color: "white" }}> Positions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {res?.data.planets.slice(1).map((planet, i) => {
                      return (
                        <Tr key={i}>
                          <Td>{planet.planet}</Td>
                          <Td>{planet.longitude}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </center>
          </Box>
        </SimpleGrid>
      ) : (
        <div className="App-center">
          <img src={loader} alt="Loading..." />
        </div>
      )}
    </div>
  );
}

export default App;
