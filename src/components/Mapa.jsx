// src/components/Mapa.jsx
import React from 'react';
import Mesa from './Mesa';

export default function Mapa({ listaMesas, terrazaHabilitada, idMesaSeleccionada, onSeleccionarMesa }) {
  return (
    <div className="plano-restaurante">
      {listaMesas.map((mesa) => {
        if (mesa.esAbsorbida) return null;

        const estaBloqueada = !terrazaHabilitada && mesa.seccion === "terraza";
        const esSeleccionada = mesa.id === idMesaSeleccionada;

        return (
          <Mesa 
            key={mesa.id} 
            datosMesa={mesa} 
            deshabilitada={estaBloqueada} 
            esSeleccionada={esSeleccionada}
            onSeleccionar={onSeleccionarMesa}
          />
        );
      })}
    </div>
  );
}