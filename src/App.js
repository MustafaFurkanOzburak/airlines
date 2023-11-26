import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';

const API_BASE_URL = 'https://api.schiphol.nl/public-flights/flights';
const APP_ID = '274c4c05';
const APP_KEY = 'e4ac444289079f2961f3f69de9df3688'; 

const FlightList = ({ flights }) => {
  return (
    <ul>
      {flights.map(flight => (
        <li key={flight.flightName}>
          {flight.direction === 'Departure' ? (
            <>
              <p>Departure</p>
              <p>Departure Time: {moment(flight.scheduleTime).format('HH:mm')}</p>
            </>
          ) : (
            <>
              <p>Arrival</p>
              <p>Arrival Time: {moment(flight.scheduleTime).format('HH:mm')}</p>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [flights, setFlights] = useState([]);
  const [filter, setFilter] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Accept: 'application/json',
          app_id: APP_ID,
          app_key: APP_KEY,
          ResourceVersion: 'v4',
        },
        params: {
          ...filter,
          includedelays: false,
          page: 0,
          sort: '+scheduleTime',
        },
      });

      const sortedFlights = response.data.flights.sort((a, b) =>
        moment(a.scheduleTime).diff(moment(b.scheduleTime))
      );

      setFlights(sortedFlights);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleFilterChange = event => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  const handleSearch = () => {
    fetchData();
  };

  return (
    <div className="container">
      <h1>Schiphol Flight Information</h1>
      <div>
        <label>
          Direction:
          <select name="direction" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Departure">Departure</option>
            <option value="Arrival">Arrival</option>
          </select>
        </label>
        <label>
          Date:
          <input type="date" name="date" onChange={handleFilterChange} />
        </label>
        <label>
          Airport Code:
          <input type="text" name="airportCode" onChange={handleFilterChange} />
        </label>

        <button onClick={handleSearch}>Search</button>
      </div>

      <FlightList flights={flights} />
    </div>
  );
};

export default App;
