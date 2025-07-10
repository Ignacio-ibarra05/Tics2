import React, { useState } from 'react';
import Navbar from './Navbar';

function UserSettings({ user, onLogout }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: user.username // Usamos el username actual como valor inicial
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil
    setSuccessMessage('Perfil actualizado correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Aquí iría la lógica para cambiar la contraseña
    setSuccessMessage('Contraseña cambiada correctamente');
    setErrorMessage('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="profile-app">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-banner" style={{ backgroundImage: 'linear-gradient(135deg, #7f00b2, #e100ff)' }}></div>
          
          <div className="profile-info">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="profile-details">
              <h1 className="profile-name">Configuración de Usuario</h1>
              <p className="profile-username">Personaliza tu perfil y configuración</p>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button className="tab-btn active">Información Personal</button>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <h2 className="section-title">Editar Perfil</h2>
            
            <form onSubmit={handleProfileSubmit} className="medidas-form">
              <div className="medidas-form-grid">
                <div className="medida-input-group">
                  <label className="medida-label">Nombre</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleProfileChange}
                    className="medida-input"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div className="medida-input-group">
                  <label className="medida-label">Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleProfileChange}
                    className="medida-input"
                    placeholder="Tu apellido"
                  />
                </div>
                
                <div className="medida-input-group">
                  <label className="medida-label">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className="medida-input"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div className="medida-input-group">
                  <label className="medida-label">Nombre de Usuario</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleProfileChange}
                    className="medida-input"
                    disabled
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="medida-submit-btn"
              >
                Guardar Cambios
              </button>
            </form>
            
            {successMessage && (
              <div className="message success mt-4">
                {successMessage}
              </div>
            )}
          </div>
          
          <div className="profile-card mt-6">
            <h2 className="section-title">Cambiar Contraseña</h2>
            
            <form onSubmit={handlePasswordSubmit} className="medidas-form">
              <div className="medidas-form-grid">
                <div className="medida-input-group">
                  <label className="medida-label">Contraseña Actual</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="medida-input"
                    required
                  />
                </div>
                
                <div className="medida-input-group">
                  <label className="medida-label">Nueva Contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="medida-input"
                    required
                  />
                </div>
                
                <div className="medida-input-group">
                  <label className="medida-label">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="medida-input"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="medida-submit-btn"
              >
                Cambiar Contraseña
              </button>
            </form>
            
            {errorMessage && (
              <div className="message error mt-4">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
