import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function MedidasForm({ user, onMedidasGuardadas }) {
  const [medidas, setMedidas] = useState({
    altura: '',
    peso: '',
    brazo: '',
    piernas: '',
    cintura: '',
    abdomen: '',
    gemelo: '',
    espalda: '',
    torso: ''
  });

  const [mensaje, setMensaje] = useState('');

  const medidasConfig = [
    { label: 'Altura (cm)', name: 'altura' },
    { label: 'Peso (kg)', name: 'peso' },
    { label: 'Brazo (cm)', name: 'brazo' },
    { label: 'Piernas (cm)', name: 'piernas' },
    { label: 'Cintura (cm)', name: 'cintura' },
    { label: 'Abdomen (cm)', name: 'abdomen' },
    { label: 'Gemelo (cm)', name: 'gemelo' },
    { label: 'Espalda (cm)', name: 'espalda' },
    { label: 'Torso (cm)', name: 'torso' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedidas(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedMedidas = Object.fromEntries(
      Object.entries(medidas).map(([k, v]) => [k, parseFloat(v)])
    );

    const nuevaMedida = {
      ...parsedMedidas,
      usuario_id: user.username,
      fecha: new Date().toISOString()
    };

    const { error, data } = await supabase
      .from('medidas')
      .insert([nuevaMedida]);

    if (error) {
      console.error('❌ Error al insertar en Supabase:', error);
      setMensaje('Error al guardar las medidas.');
    } else {
      setMensaje('✅ Medidas guardadas exitosamente.');
      setMedidas({
        altura: '', peso: '', brazo: '', piernas: '',
        cintura: '', abdomen: '', gemelo: '', espalda: '', torso: ''
      });

      if (onMedidasGuardadas) {
        onMedidasGuardadas(data[0]); // para actualizar la vista externa
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="medidas-form">
      <div className="medidas-form-grid">
        {medidasConfig.map((item) => (
          <div key={item.name} className="medida-input-group">
            <label className="medida-label">{item.label}</label>
            <input
              type="number"
              name={item.name}
              value={medidas[item.name]}
              onChange={handleChange}
              className="medida-input"
              required
              step="0.01"
            />
          </div>
        ))}
      </div>
      
      <button type="submit" className="medida-submit-btn">
        Guardar Medidas
      </button>

      {mensaje && <p className="medida-msg">{mensaje}</p>}
    </form>
  );
}

export default MedidasForm;


/*
import React, { useState } from 'react';

function MedidasForm({ onAddMedidas }) {

  const [medidas, setMedidas] = useState({
    altura: '',
    peso: '',
    brazo: '',
    piernas: '',
    cintura: '',
    abdomen: '',
    gemelo: '',
    espalda: '',
    torso: ''
  });

  const medidasConfig = [
    { label: 'Altura (cm)', name: 'altura' },
    { label: 'Peso (kg)', name: 'peso' },
    { label: 'Brazo (cm)', name: 'brazo' },
    { label: 'Piernas (cm)', name: 'piernas' },
    { label: 'Cintura (cm)', name: 'cintura' },
    { label: 'Abdomen (cm)', name: 'abdomen' },
    { label: 'Gemelo (cm)', name: 'gemelo' },
    { label: 'Espalda (cm)', name: 'espalda' },
    { label: 'Torso (cm)', name: 'torso' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedidas(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMedidas(medidas);
    setMedidas({
      altura: '',
      peso: '',
      brazo: '',
      piernas: '',
      cintura: '',
      abdomen: '',
      gemelo: '',
      espalda: '',
      torso: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="medidas-form">
      <div className="medidas-form-grid">
        {medidasConfig.map((item) => (
          <div key={item.name} className="medida-input-group">
            <label className="medida-label">{item.label}</label>
            <input
              type="number"
              name={item.name}
              value={medidas[item.name]}
              onChange={handleChange}
              className="medida-input"
              required
              step="0.01"
            />
          </div>
        ))}
      </div>
      
      <button
        type="submit"
        className="medida-submit-btn"
      >
        Guardar Medidas
      </button>
    </form>
  );
}

export default MedidasForm;
*/