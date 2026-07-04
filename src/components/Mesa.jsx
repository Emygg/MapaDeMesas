import React from 'react';

export default function Mesa({ datosMesa, deshabilitada, esSeleccionada, onSeleccionar }) {
  const { id, numero, capacidadMax, comensalesActuales, estado, mesera, posicion, filasSpan } = datosMesa;

  // Colores translúcidos (RGBA) para el efecto cristal
  let colorFondo = "rgba(46, 204, 113, 0.25)"; // Verde esmerilado (Libre)
  if (estado === "ocupada") colorFondo = "rgba(231, 76, 60, 0.35)"; // Rojo esmerilado (Ocupada)
  if (estado === "reservada") colorFondo = "rgba(243, 156, 18, 0.35)";   // Naranja esmerilado (Sucia)
  if (deshabilitada) colorFondo = "rgba(149, 165, 166, 0.15)";        // Gris transparente (Clima)

  const estiloMesa = {
    background: colorFondo,
    gridColumn: posicion.columna,
    gridRow: `${posicion.fila} / span ${filasSpan || 1}`,
    opacity: deshabilitada ? 0.4 : 1,
    pointerEvents: deshabilitada ? 'none' : 'auto',
    // Resaltado de selección adaptado al modo cristal
    border: esSeleccionada ? "2px solid rgba(255, 255, 255, 0.9)" : "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: esSeleccionada 
      ? "0 0 20px rgba(255, 255, 255, 0.4), inset 0 0 15px rgba(255,255,255,0.3)" 
      : "-5px 10px 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.1)"
  };

  return (
    <div 
      className={`tarjeta-mesa ${esSeleccionada ? 'seleccionada' : ''}`} 
      style={estiloMesa}
      onClick={() => onSeleccionar && onSeleccionar(id)}
    >
      <h4>{numero}</h4>
      <p>{comensalesActuales} / {capacidadMax} Pax</p>
      {mesera && <small>👤 {mesera}</small>}
      {deshabilitada && <span className="etiqueta-lluvia">🌧️</span>}
    </div>
  );
}