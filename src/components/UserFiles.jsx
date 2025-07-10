import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

function UserFiles({ user, onLogout }) {
  const [archivos, setArchivos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const username = user.username.toLowerCase();

  useEffect(() => {
    const cargarArchivos = async () => {
      setMensaje('');
      const { data, error } = await supabase
        .storage
        .from('archivos')
        .list(`${username}/`, { limit: 100 });

      if (error) {
        console.error('Error al listar archivos:', error);
        setMensaje('❌ Error al obtener archivos');
      } else if (data.length === 0) {
        setMensaje('No tienes archivos disponibles');
      } else {
        setArchivos(data);
      }
    };

    if (user?.username) {
      cargarArchivos();
    }
  }, [user]);

  const handleDownload = async (fileName) => {
    const { data, error } = await supabase
      .storage
      .from('archivos')
      .createSignedUrl(`${username}/${fileName}`, 60);

    if (error) {
      alert('❌ No se pudo generar el enlace de descarga');
    } else {
      window.open(data.signedUrl, '_blank');
    }
  };

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <div className="user-files-container">
        <h1>Mis Archivos</h1>

        {mensaje ? (
          <p className="no-files">{mensaje}</p>
        ) : (
          <div className="files-list">
            {archivos.map((file, index) => (
              <div key={index} className="file-card">
                <div className="file-info">
                  <span className={`file-icon ${file.name.endsWith('.pdf') ? 'pdf' : 'excel'}`}>
                    {file.name.endsWith('.pdf') ? '📄' : '📊'}
                  </span>
                  <div>
                    <h3>{file.name}</h3>
                    <p>Subido el: (fecha no disponible)</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(file.name)}
                  className="download-btn"
                >
                  Descargar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserFiles;

/*
import React from 'react';
import Navbar from './Navbar';

// Datos de ejemplo - en una app real vendrían de una API
const sampleFiles = [
  { id: 1, name: 'Rutina_Ejercicios.xlsx', date: '2023-05-15', type: 'excel' },
  { id: 2, name: 'Resultados_Analisis.pdf', date: '2023-06-01', type: 'pdf' },
  { id: 3, name: 'Plan_Nutricional.pdf', date: '2023-06-10', type: 'pdf' },
];

function UserFiles({ user, onLogout }) {
  const handleDownload = (fileName) => {
    // Simulación de descarga
    alert(`Descargando ${fileName}`);
  };

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="user-files-container">
        <h1>Mis Archivos</h1>
        
        {sampleFiles.length === 0 ? (
          <p className="no-files">No tienes archivos disponibles</p>
        ) : (
          <div className="files-list">
            {sampleFiles.map(file => (
              <div key={file.id} className="file-card">
                <div className="file-info">
                  <span className={`file-icon ${file.type}`}>
                    {file.type === 'pdf' ? '📄' : '📊'}
                  </span>
                  <div>
                    <h3>{file.name}</h3>
                    <p>Subido el: {file.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownload(file.name)}
                  className="download-btn"
                >
                  Descargar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserFiles;
*/