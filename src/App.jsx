// src/App.jsx
import { useState, useEffect } from 'react'; // 👈 Importamos useEffect
import { mesasIniciales } from './data/mesas';
import Mapa from './components/Mapa';
import PanelDetalle from './components/PanelDetalle';
import './App.css';

function App() {
  // 1. Inicializamos los estados leyendo directamente de LocalStorage si existen
  const [mesas, setMesas] = useState(() => {
    const datosGuardados = localStorage.getItem('mapa_mesas_v1');
    return datosGuardados ? JSON.parse(datosGuardados) : mesasIniciales;
  });

  const [terrazaHabilitada, setTerrazaHabilitada] = useState(() => {
    const climaGuardado = localStorage.getItem('clima_terraza_v1');
    return climaGuardado ? JSON.parse(climaGuardado) : true;
  });

  const [idMesaSeleccionada, setIdMesaSeleccionada] = useState(null);

  // 2. EFECTO: Guarda automáticamente las mesas cada vez que cambien
  useEffect(() => {
    localStorage.setItem('mapa_mesas_v1', JSON.stringify(mesas));
  }, [mesas]);

  // 3. EFECTO: Guarda automáticamente el estado del clima
  useEffect(() => {
    localStorage.setItem('clima_terraza_v1', JSON.stringify(terrazaHabilitada));
  }, [terrazaHabilitada]);


  const mesaSeleccionada = mesas.find(m => m.id === idMesaSeleccionada);

  const actualizarMesaGoblal = (idMesa, nuevosDatos) => {
    const mesasActualizadas = mesas.map((m) => {
      if (m.id === idMesa) {
        return { ...m, ...nuevosDatos };
      }
      return m;
    });
    setMesas(mesasActualizadas);
  };

  const unirMesas = (idPadre, idHija) => {
    const mesaHijaObj = mesas.find(m => m.id === idHija);
    if (!mesaHijaObj || mesaHijaObj.esAbsorbida) return;

    const mesasActualizadas = mesas.map((mesa) => {
      if (mesa.id === idPadre) {
        return {
          ...mesa,
          numero: `${mesa.numero} + ${mesaHijaObj.numeroOriginal}`,
          capacidadMax: mesa.capacidadMax + mesaHijaObj.capacidadBase,
          mesasHijas: [...mesa.mesasHijas, idHija],
          filasSpan: mesa.filasSpan + mesaHijaObj.filasSpan
        };
      }
      if (mesa.id === idHija) {
        return {
          ...mesa,
          esAbsorbida: true,
          estado: "ocupada",
          comensalesActuales: 0
        };
      }
      return mesa;
    });
    setMesas(mesasActualizadas);
  };

  const separarMesas = (idPadre) => {
    const mesaPadre = mesas.find(m => m.id === idPadre);
    if (!mesaPadre || mesaPadre.mesasHijas.length === 0) return;

    const hijasA_Liberar = mesaPadre.mesasHijas;

    const mesasRestauradas = mesas.map((mesa) => {
      if (mesa.id === idPadre) {
        return {
          ...mesa,
          numero: mesa.numeroOriginal,
          capacidadMax: mesa.capacidadBase,
          mesasHijas: [],
          filasSpan: 1,
          comensalesActuales: 0,
          estado: "libre",
          mesera: null
        };
      }
      if (hijasA_Liberar.includes(mesa.id)) {
        return {
          ...mesa,
          esAbsorbida: false,
          comensalesActuales: 0,
          estado: "libre",
          mesera: null,
          filasSpan: 1
        };
      }
      return mesa;
    });
    setMesas(mesasRestauradas);
    setIdMesaSeleccionada(null);
  };

  // 🔄 FUNCIÓN DE NEGOCIO: Reiniciar el mapa para un nuevo turno o día
  const reiniciarMapaCompleto = () => {
    const confirmar = window.confirm(
      "⚠️ ¿Estás seguro de reiniciar el turno? Esto liberará todas las uniones, comensales y meseras actuales del mapa."
    );
    if (confirmar) {
      setMesas(mesasIniciales);
      setTerrazaHabilitada(true);
      setIdMesaSeleccionada(null);
      // Limpiamos explícitamente el almacenamiento local
      localStorage.removeItem('mapa_mesas_v1');
      localStorage.removeItem('clima_terraza_v1');
    }
  };

  // --- KPIs ---
  const mesasOperativas = mesas.filter(m => terrazaHabilitada || m.seccion !== "terraza");
  const totalComensales = mesasOperativas.reduce((acc, m) => acc + m.comensalesActuales, 0);
  const capacidadTotalValida = mesasOperativas.reduce((acc, m) => acc + m.capacidadMax, 0);
  const asientosLibres = capacidadTotalValida - totalComensales;
  const mesasOcupadasCount = mesasOperativas.filter(m => m.estado === "ocupada").length;

  return (
    <div className="contenedor-app">
      <header className="barra-superior">
        <div>
          <h1>Dashboard Hostess 🍽️</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#7f8c8d' }}>Versión MVP Local</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {/* Botón de reinicio de turno operativo */}
          <button className="btn-reiniciar" onClick={reiniciarMapaCompleto}>
            🔄 Reiniciar Turno
          </button>
          <button 
            className={`btn-clima ${terrazaHabilitada ? 'sol' : 'lluvia'}`}
            onClick={() => setTerrazaHabilitada(!terrazaHabilitada)}
          >
            {terrazaHabilitada ? "☀️ Terraza Abierta" : "🌧️ Terraza Cerrada"}
          </button>
        </div>
      </header>

      <section className="panel-kpis">
        <div className="kpi-card">
          <h3>{totalComensales}</h3>
          <p>Comensales Sentados</p>
        </div>
        <div className="kpi-card">
          <h3>{asientosLibres}</h3>
          <p>Asientos Disponibles</p>
        </div>
        <div className="kpi-card">
          <h3>{mesasOcupadasCount} / {mesasOperativas.length}</h3>
          <p>Mesas Ocupadas</p>
        </div>
      </section>

      <main className="distribucion-pantalla">
        <div className="contenedor-mapa-scroll">
          <Mapa 
            listaMesas={mesas} 
            terrazaHabilitada={terrazaHabilitada} 
            idMesaSeleccionada={idMesaSeleccionada}
            onSeleccionarMesa={setIdMesaSeleccionada}
          />
        </div>

        <PanelDetalle 
          mesa={mesaSeleccionada}
          listaCompletaMesas={mesas}
          onActualizarMesa={actualizarMesaGoblal}
          onUnirMesas={unirMesas}
          onSepararMesas={separarMesas}
          onCerrar={() => setIdMesaSeleccionada(null)}
        />
      </main>
    </div>
  );
}

export default App;