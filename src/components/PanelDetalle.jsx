// src/components/PanelDetalle.jsx
import React, { useState, useEffect } from 'react';

export default function PanelDetalle({ mesa, listaCompletaMesas, onActualizarMesa, onUnirMesas, onSepararMesas, onCerrar }) {
  if (!mesa) return null;

  const [comensales, setComensales] = useState(mesa.comensalesActuales);
  const [estado, setEstado] = useState(mesa.estado);
  const [mesera, setMesera] = useState(mesa.mesera || '');
  const [mesaHijaSeleccionada, setMesaHijaSeleccionada] = useState('');

  useEffect(() => {
    setComensales(mesa.comensalesActuales);
    setEstado(mesa.estado);
    setMesera(mesa.mesera || '');
    setMesaHijaSeleccionada('');
  }, [mesa]);

  const manejarGuardar = (e) => {
    e.preventDefault();
    if (comensales > mesa.capacidadMax) {
      alert(`¡Error! La capacidad máxima es de ${mesa.capacidadMax} personas.`);
      return;
    }

    let estadoFinal = estado;
    if (comensales > 0 && estado === 'libre') estadoFinal = 'ocupada';
    if (comensales === 0 && estado === 'ocupada') estadoFinal = 'libre';

    onActualizarMesa(mesa.id, {
      comensalesActuales: Number(comensales),
      estado: estadoFinal,
      mesera: mesera.trim() === '' ? null : mesera
    });
  };

  // ================= ALGORITMO DE VALIDACIÓN DE ADYACENCIA =================
  // La fila inmediatamente debajo de esta mesa (o del bloque unido actual)
  const filaSiguiente = mesa.posicion.fila + mesa.filasSpan;

  const mesasDisponiblesParaUnir = listaCompletaMesas.filter(m => 
    m.id !== mesa.id && 
    !m.esAbsorbida && 
    m.estado === 'libre' &&
    m.posicion.columna === mesa.posicion.columna && // Regla 1: Misma columna
    m.posicion.fila === filaSiguiente              // Regla 2: Justo la fila de abajo
  );

  return (
    <aside className="panel-lateral">
      <div className="panel-header">
        <h2>Control: {mesa.numero}</h2>
        <button className="btn-cerrar" onClick={onCerrar}>✕</button>
      </div>

      {/* SECCIÓN DE UNIONES MÚLTIPLES */}
      <div className="contenedor-gestion-uniones" style={{ marginBottom: '20px' }}>
        
        {/* Si ya es una unión, listamos el botón de separar pero NO bloqueamos el panel */}
        {mesa.mesasHijas.length > 0 && (
          <div className="seccion-union-alerta" style={{ marginBottom: '12px' }}>
            <p>⛓️ Combinación Activa: {mesa.numero}</p>
            <button 
              type="button" 
              className="btn-separar"
              onClick={() => onSepararMesas(mesa.id)}
            >
              Separar Todas las Mesas
            </button>
          </div>
        )}

        {/* Selector dinámico de vecinas de abajo */}
        {mesasDisponiblesParaUnir.length > 0 ? (
          <div className="seccion-unir-controles">
            <label>🔗 Unir con vecina de abajo:</label>
            <div className="sub-grupo-unir">
              <select 
                value={mesaHijaSeleccionada} 
                onChange={(e) => setMesaHijaSeleccionada(e.target.value)}
              >
                <option value="">Selecciona mesa...</option>
                {mesasDisponiblesParaUnir.map(m => (
                  <option key={m.id} value={m.id}>{m.numeroOriginal} ({m.capacidadBase} Pax)</option>
                ))}
              </select>
              <button 
                type="button" 
                className="btn-unir"
                disabled={!mesaHijaSeleccionada}
                onClick={() => {
                  onUnirMesas(mesa.id, mesaHijaSeleccionada);
                  setMesaHijaSeleccionada(''); // Resetea el selector local
                }}
              >
                + Juntar
              </button>
            </div>
          </div>
        ) : (
          mesa.mesasHijas.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: '#95a5a6', fontStyle: 'italic', margin: '0' }}>
              No hay mesas libres adyacentes abajo para unir.
            </p>
          )
        )}
      </div>

      <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #f5f6fa' }} />

      {/* FORMULARIO ESTÁNDAR */}
      <form onSubmit={manejarGuardar} className="formulario-panel">
        <div className="campo">
          <label>Capacidad Máxima Combinada:</label>
          <span className="texto-fijo">{mesa.capacidadMax} Pax</span>
        </div>

        <div className="campo">
          <label>Estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="libre">🟢 Libre</option>
            <option value="ocupada">🔴 Ocupada</option>
            <option value="Reservada">🟠 Reservada</option>
          </select>
        </div>

        <div className="campo">
          <label>Comensales:</label>
          <input 
            type="number" 
            min="0" 
            max={mesa.capacidadMax}
            value={comensales} 
            onChange={(e) => setComensales(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Mesera:</label>
          <input 
            type="text" 
            placeholder="Nombre de la mesera"
            value={mesera} 
            onChange={(e) => setMesera(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-guardar">Actualizar Datos</button>
      </form>
    </aside>
  );
}