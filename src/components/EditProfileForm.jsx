// components/EditProfileForm.jsx
import React, { useState, useEffect } from 'react';
import './EditProfileForm.css'; // Asegúrate de tener este archivo CSS o integrarlo en tu App.css

function EditProfileForm({ initialData, onSave, onCancel }) {
  const [name, setName] = useState(initialData?.name || '');
  const [username, setUsername] = useState(initialData?.username || '');
  const [currentPassword, setCurrentPassword] = useState(''); // Nuevo estado para la contraseña actual
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // Para confirmar la nueva contraseña
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Sincroniza initialData con los estados locales
  useEffect(() => {
    setName(initialData?.name || '');
    setUsername(initialData?.username || '');
    // Resetear las contraseñas al abrir el formulario o cambiar el usuario
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
    setMessage('');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validación básica
    if (!name.trim() || !username.trim()) {
      setError('El nombre y el nombre de usuario no pueden estar vacíos.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) { // Requisito mínimo de longitud de contraseña de Supabase
        setError('La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setError('La nueva contraseña y la confirmación no coinciden.');
        return;
      }
      if (!currentPassword) {
        setError('Por favor, ingresa tu contraseña actual para cambiarla.');
        return;
      }
    }

    // Llama a onSave, pasando la nueva contraseña y la contraseña actual
    onSave(
      { name, username },
      newPassword,
      currentPassword // Pasa la contraseña actual
    );

    // No limpiar los campos aquí, Perfil.jsx manejará la limpieza/cierre del formulario
    // si la operación fue exitosa.
  };

  return (
    <div className="edit-profile-form-container">
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <h2 className="form-title">Editar Perfil</h2>
        
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <hr className="form-divider" /> {/* Separador visual para contraseñas */}
        <h3 className="form-subtitle">Cambiar Contraseña (opcional)</h3>

        <div className="form-group">
          <label htmlFor="current-password">Contraseña Actual:</label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="form-input"
            placeholder="Requerida para cambiar contraseña"
          />
        </div>

        <div className="form-group">
          <label htmlFor="new-password">Nueva Contraseña:</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-new-password">Confirmar Nueva Contraseña:</label>
          <input
            type="password"
            id="confirm-new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="form-input"
            placeholder="Repite la nueva contraseña"
          />
        </div>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-message">{message}</p>}

        <div className="form-actions">
          <button type="submit" className="save-button">Guardar Cambios</button>
          <button type="button" onClick={onCancel} className="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;
