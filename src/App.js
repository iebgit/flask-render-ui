import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import parse from "html-react-parser";
const regexPattern = /[^A-Za-z]/g;
function App() {
  const [res, setRes] = useState(null);
  const [position, setPosition] = useState({});

  useEffect(() => {
    const getSidereal = async () => {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      console.log(data);

      const sidereal = await axios.get(
        `https://astrapredict.onrender.com//astro/sidereal`,
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
      console.log(
        `./images/${sidereal.data.planets[0].longitude
          .replace(regexPattern, "")
          .toLowerCase()}${sidereal.data.planets[0].padam - 1}.png`,
        sidereal
      );

      setRes(sidereal);
    };
    getSidereal();
  }, []);
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  return (
    <center className="App-header">
      {res && (
        <>
          <strong style={{ color: "#FCB13B" }}>
            {res?.data.location.city}, {res?.data.location.region}
          </strong>
          <small>{res?.data.location.time}</small>
          <br />

          <h4
            style={{
              color: "#FF6630",
            }}
          >
            {res?.data.planets[0].planet.toUpperCase()}:{" "}
            {res?.data.planets[0].longitude}
          </h4>

          <br />
          <img
            style={{ borderRadius: "50%", maxWidth: "50%" }}
            src={`/images/${res.data.planets[0].longitude
              .replace(regexPattern, "")
              .toLowerCase()}${getRandomInt(4)}.png`}
            alt="image not found"
          ></img>
          <br />
          <table>
            <tbody>
              <tr>
                <th>Planet</th>
                <th>Position</th>
              </tr>
              {res?.data.planets.slice(1).map((planet, i) => {
                return (
                  <tr key={i}>
                    <td>{planet.planet}</td>
                    <td>{planet.longitude}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br />
        </>
      )}
    </center>
  );
}

export default App;
