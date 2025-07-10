import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

function UserFiles({ user, onLogout }) {
  const [archivos, setArchivos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  // 'username' se calcula a partir de 'user.username', por lo que debe ser
  // una dependencia del useEffect si se usa dentro de él.
  const username = user.username.toLowerCase();

  useEffect(() => {
    const cargarArchivos = async () => {
      setMensaje('');
      const { data, error } = await supabase
        .storage
        .from('archivos')
        // 'username' se usa aquí, por lo tanto debe ser una dependencia
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

    // La condición 'user?.username' también implica una dependencia de 'user'
    if (user?.username) {
      cargarArchivos();
    }
  }, [user, username]); // <-- ¡Aquí está la corrección! 'user' y 'username' añadidos como dependencias.

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
