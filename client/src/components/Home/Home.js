import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [location, setLocation] = useState("");
  const [current, setCurrent] = useState("");
  const [forecast, setForecast] = useState("");
  const [search, setSearch] = useState("");
  const [filteredForecastTime, setfilteredForecastTime] = useState("");
  const [error, setError] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/city?city=${search}`, {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        }),
      });
      setError(false);
      setLocation(res?.data?.location);
      setCurrent(res?.data?.current);
      setForecast(res?.data?.forecast?.forecastday[0]);
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    let fTime = location.localtime?.substring(11, 16);
    let forecast_time = forecast?.hour?.map((item) => {
      if (
        fTime[0] === "6" ||
        fTime[0] === "7" ||
        fTime[0] === "8" ||
        fTime[0] === "9"
      ) {
        fTime = "0" + fTime;
      }
      return (
        item.time.substring(11, 16) > fTime && {
          time: item.time?.substring(11, 16),
          temp: item?.temp_c,
        }
      );
    });

    let forecast_filter = forecast_time?.filter(Boolean);
    setfilteredForecastTime(forecast_filter);
  }, [forecast, location?.localtime]);

  useEffect(() => {
    const defaultData = async () => {
      let defaultVal = "Tel Aviv";
      if (!search) {
        const res = await axios.get(
          `http://localhost:5000/city?city=${defaultVal}`,
          {
            method: "GET",
            headers: new Headers({
              Accept: "application/json",
              "Content-Type": "application/json;charset=utf-8",
            }),
          }
        );
        setLocation(res?.data?.location);
        setCurrent(res?.data?.current);
        setForecast(res?.data?.forecast?.forecastday[0]);
      }
    };
    defaultData();
  }, [search]);

  return (
    <div className="container">
      <div className="left">
        <div className="area1">
          <div className="img"></div>
          <div className="text-container">
            <p className="text">
              Use our weather app to see the weather around the world
            </p>
          </div>
          <div className="input-container">
            <div className="input-area">
              <form onSubmit={handleChange}>
                <label htmlFor="name">City name</label>
                <input
                  type="text"
                  className="input"
                  name="name"
                  placeholder="Enter city"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  required
                />
                <button type="submit" className="btn">
                  Check
                </button>
              </form>
            </div>
            <div className="error">
              {error && "No matching location found."}
            </div>
          </div>

          <div className="details">
            <div className="lat_lon-container">
              <p>latitude {location?.lat}</p>
              <p>latitude {location?.lon}</p>
            </div>
            <p className="date">accurate to {location?.localtime}</p>
          </div>
        </div>
      </div>

      <div className="right">
        <div className="first-square">
          <div className="inner-square">
            <div className="details-1">
              <span className="cityname">{location?.name}</span>
              <span className="countryname">{location?.country}</span>
              <span className="localtime">{location?.localtime}</span>
            </div>

            <div className="details-1">
              <span className="celsius"></span>
              <div className="details-1-1">
                <span className="degree">
                  {current?.temp_c && Math.round(current?.temp_c)}
                </span>
                <span className="weather">{current?.condition?.text}</span>
              </div>
            </div>

            <div className="details-1 row">
              <span className="precip">
                precipitation <br />
                <span>{current?.precip_mm} mm</span>
              </span>
              <span className="precip">
                humidity <br /> <span cla>{current?.humidity} %</span>
              </span>
              <span className="precip">
                wind <br /> <span>{current?.wind_kph} km/h</span>
              </span>
            </div>

            {forecast && (
              <div className="details-1 row">
                {filteredForecastTime?.map((item, i) => {
                  return (
                    i < 5 && (
                      <div className="filterForecast" key={i}>
                        <span className="forecast_time">{item?.time}</span>
                        <span className="forecast_temp">
                          {Math.round(item?.temp)}
                        </span>
                      </div>
                    )
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
