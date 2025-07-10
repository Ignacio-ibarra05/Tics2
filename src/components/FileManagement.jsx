import React, { useState } from 'react';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

function FileManagement({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!searchTerm || !selectedFile) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    const username = searchTerm.trim().toLowerCase();
    const filePath = `${username}/${Date.now()}_${selectedFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from('archivos')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      setMessage('❌ Error al subir archivo');
      console.error(uploadError);
    } else {
      setMessage(`✅ Archivo "${selectedFile.name}" subido para "${username}"`);
      setSelectedFile(null);
      document.getElementById('file-input').value = '';
    }

    setIsLoading(false);
  };

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <div className="file-management-container">
        <h1 className="admin-title">Gestión de Archivos</h1>

        <div className="upload-section">
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label>Buscar Usuario:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre de usuario"
                className="search-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Seleccionar Archivo:</label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".pdf,.xlsx,.xls"
                required
              />
              {selectedFile && (
                <p className="file-info">Archivo seleccionado: {selectedFile.name}</p>
              )}
            </div>

            <button 
              type="submit" 
              className="upload-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Subiendo...' : 'Subir Archivo'}
            </button>
          </form>

          {message && (
            <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileManagement;

/*
import React, { useState } from 'react';
import Navbar from './Navbar';

function FileManagement({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm || !selectedFile) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    // Simulación de subida de archivo
    setTimeout(() => {
      setMessage(`Archivo ${selectedFile.name} subido para ${searchTerm}`);
      setSelectedFile(null);
      document.getElementById('file-input').value = '';
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="file-management-container">
        <h1 className="admin-title">Gestión de Archivos</h1>
        
        <div className="upload-section">
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label>Buscar Usuario:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre de usuario"
                className="search-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Seleccionar Archivo:</label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".pdf,.xlsx,.xls"
                required
              />
              {selectedFile && (
                <p className="file-info">Archivo seleccionado: {selectedFile.name}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="upload-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Subiendo...' : 'Subir Archivo'}
            </button>
          </form>
          
          {message && <p className={`message ${message.includes('éxito') ? 'success' : ''}`}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default FileManagement;
*/