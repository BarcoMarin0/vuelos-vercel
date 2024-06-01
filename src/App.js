import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  // Estados para almacenar la entrada del usuario, la lista de países, el país seleccionado,
  // el mes seleccionado, el día seleccionado y la información guardada
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedInfo, setSelectedInfo] = useState([]);

  // Efecto para cargar la lista de países al cargar el componente
  useEffect(() => {
    fetchCountries();
  }, []);

  // Función para obtener la lista de países desde el backend
  const fetchCountries = async () => {
    try {
      const response = await fetch('/paises');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error al obtener la lista de países:', error);
    }
  };

  // Función para buscar países según el término de búsqueda
  const handleSearch = useCallback(async (event) => {
    setSearchTerm(event.target.value);
    try {
      const response = await fetch(`/buscar-paises?searchTerm=${event.target.value}`);
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error al buscar países:', error);
    }
  }, []);

  // Función para manejar la selección de país
  const handleCountrySelect = (event) => {
    setSelectedCountry(event.target.value);
  };

  // Función para manejar la selección de mes
  const handleMonthSelect = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Función para manejar la selección de día
  const handleDaySelect = (event) => {
    setSelectedDay(event.target.value);
  };

  // Función para guardar la información seleccionada en la base de datos
  const handleSaveInfo = async () => {
    if (selectedCountry && selectedMonth && selectedDay) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountry,
          month: selectedMonth,
          day: selectedDay
        })
      };
      try {
        const response = await fetch('/guardar-info', requestOptions);
        if (response.ok) {
          console.log('Información guardada exitosamente en la base de datos.');
          // Actualizar el estado selectedInfo con la nueva información guardada
          setSelectedInfo([...selectedInfo, {
            country: selectedCountry,
            month: selectedMonth,
            day: selectedDay
          }]);
        } else {
          console.error('Error al guardar la información en la base de datos.');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    }
  };

  // Renderización del componente
  return (
    <div className="App">
      {/* Contenedor del buscador */}
      <div className="search-container">
        {/* Campo de entrada para buscar países */}
        <input
          type="text"
          placeholder="Buscar países..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {/* Lista desplegable para seleccionar un país */}
        <select onChange={handleCountrySelect} value={selectedCountry}>
          <option value="">Selecciona un país</option>
          {countries.map((country, index) => (
            <option key={index} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        {/* Lista desplegable para seleccionar un mes */}
        <select onChange={handleMonthSelect} value={selectedMonth}>
          <option value="">Selecciona un mes</option>
          <option value="Enero">Enero</option>
          <option value="Febrero">Febrero</option>
          <option value="Marzo">Marzo</option>
          <option value="Abril">Abril</option>
          <option value="Mayo">Mayo</option>
          <option value="Junio">Junio</option>
          <option value="Julio">Julio</option>
          <option value="Agosto">Agosto</option>
          <option value="Septiembre">Septiembre</option>
          <option value="Octubre">Octubre</option>
          <option value="Noviembre">Noviembre</option>
          <option value="Diciembre">Diciembre</option>
        </select>
        {/* Lista desplegable para seleccionar un día */}
        <select onChange={handleDaySelect} value={selectedDay}>
          <option value="">Selecciona un día</option>
          {[...Array(31)].map((_, index) => (
            <option key={index + 1} value={index + 1}>{index + 1}</option>
          ))}
        </select>
        {/* Botón para guardar la información */}
        <button onClick={handleSaveInfo}>Guardar</button>
      </div>
      {/* Título */}
      <h2 className='titulo'>Reservación de Vuelo</h2>
      {/* Contenedor de la información guardada */}
      <div className="info-container">
        <ul>
          {selectedInfo.map((info, index) => (
            <li key={index}>
              País: {info.country}, Mes: {info.month}, Día: {info.day}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
