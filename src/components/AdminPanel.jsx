import React, { useState } from 'react'
import Navbar from './Navbar'
import { supabase } from '../supabaseClient'

function AdminPanel({ user, onLogout }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)

    // Intentar crear nuevo usuario
    const { error } = await supabase.from('usuarios').insert([
      {
        correo: email,
        username: email.split('@')[0],
        contrasena: '1234', // por ahora, contraseña por defecto
        rol: 'cliente',
        nombre: email.split('@')[0]
      }
    ])

    if (error) {
      setMessage(`❌ Error al crear usuario: ${error.message}`)
    } else {
      setMessage(`✅ Usuario creado correctamente para ${email}`)
    }

    setEmail('')
    setIsLoading(false)
  }

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <div className="admin-panel-container">
        <h1 className="admin-title">Panel de Invitaciones</h1>

        <div className="invite-section">
          <h2>Invitar Nuevo Usuario</h2>

          <form onSubmit={handleSubmit} className="invite-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@ejemplo.com"
                className="email-input"
              />
            </div>

            <button type="submit" className="invite-btn" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

/*
import React, { useState } from 'react';
import Navbar from './Navbar';

function AdminPanel({ user, onLogout }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de envío de invitación
    setTimeout(() => {
      setMessage(`Invitación enviada a ${email}`);
      setEmail('');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="admin-panel-container">
        <h1 className="admin-title">Panel de Invitaciones</h1>
        
        <div className="invite-section">
          <h2>Invitar Nuevo Usuario</h2>
          
          <form onSubmit={handleSubmit} className="invite-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ingresa el correo del usuario"
                className="email-input"
              />
            </div>
            
            <button 
              type="submit" 
              className="invite-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Invitación'}
            </button>
          </form>
          
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
*/