// src/components/Mesa.jsx
import React from 'react';

export default function Mesa({ datosMesa, deshabilitada, esSeleccionada, onSeleccionar }) {
  const { id, numero, capacidadMax, comensalesActuales, estado, mesera, posicion, filasSpan } = datosMesa;

  let colorFondo = "#2ecc71"; // Libre
  if (estado === "ocupada") colorFondo = "#e74c3c"; // Ocupada
  if (estado === "sucia") colorFondo = "#f39c12";   // Sucia

  if (deshabilitada) colorFondo = "#95a5a6"; // Clima

  const estiloMesa = {
    backgroundColor: colorFondo,
    gridColumn: posicion.columna,
    gridRow: `${posicion.fila} / span ${filasSpan || 1}`,
    opacity: deshabilitada ? 0.5 : 1,
    pointerEvents: deshabilitada ? 'none' : 'auto',
    // Si está seleccionada, le añadimos un borde grueso e iluminado
    border: esSeleccionada ? "3px solid #2d3436" : "none",
    boxShadow: esSeleccionada ? "0 0 15px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.12)"
  };

  return (
    <div 
      className={`tarjeta-mesa ${esSeleccionada ? 'seleccionada' : ''}`} 
      style={estiloMesa}
      onClick={() => onSeleccionar(id)} // Pasamos el ID al hacer clic
    >
      <h4>{numero}</h4>
      <p>{comensalesActuales} / {capacidadMax} Pax</p>
      {mesera && <small>👤 {mesera}</small>}
      {deshabilitada && <span className="etiqueta-lluvia">🌧️</span>}
    </div>
  );
}