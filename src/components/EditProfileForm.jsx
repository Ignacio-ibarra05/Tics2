// EditProfileForm.jsx
import React, { useState, useEffect } from 'react';

function EditProfileForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sincroniza el estado interno del formulario si initialData cambia desde el padre
  useEffect(() => {
    setFormData(initialData);
    // Limpiar campos de contraseña al recargar o cancelar
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    // Limpiar el error cuando el usuario empieza a escribir
    if (passwordError) setPasswordError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Limpiar el error cuando el usuario empieza a escribir
    if (passwordError) setPasswordError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar contraseñas si se está intentando cambiar
    if (newPassword || confirmPassword) { // Solo validar si alguno de los campos de contraseña no está vacío
      if (newPassword.length < 6) { // Ejemplo de validación de longitud mínima
        setPasswordError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden.');
        return;
      }
    }

    // Si todo es válido o no se está cambiando la contraseña, procede
    onSave(formData, newPassword); // Pasa también la nueva contraseña (vacía si no se cambió)
    setNewPassword(''); // Limpia los campos después de guardar
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <h2>Editar Perfil</h2>
      <div className="form-group">
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="username">Nombre de Usuario:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <h3 className="section-subtitle">Cambiar Contraseña (opcional)</h3>
      <div className="form-group">
        <label htmlFor="newPassword">Nueva Contraseña:</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={handlePasswordChange}
          placeholder="Dejar en blanco para no cambiar"
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </div>
      {passwordError && <p className="error-message" style={{ color: 'red', fontSize: '0.9em', marginTop: '-0.5rem', marginBottom: '1rem' }}>{passwordError}</p>}

      <div className="form-actions">
        <button type="submit" className="btn-primary">Guardar Cambios</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

export default EditProfileForm;
