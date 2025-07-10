import React, { useState, useEffect } from 'react';

function EditProfileForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData);

  // Sincroniza el estado interno del formulario si initialData cambia desde el padre
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
          required // Campo requerido
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
          required // Campo requerido
        />
      </div>
      {/* Puedes añadir más campos aquí para editar, por ejemplo: */}
      {/*
      <div className="form-group">
        <label htmlFor="avatar_url">URL de Avatar:</label>
        <input
          type="text"
          id="avatar_url"
          name="avatar_url"
          value={formData.avatar_url || ''}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="bio">Biografía:</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>
      */}
      <div className="form-actions">
        <button type="submit" className="btn-primary">Guardar Cambios</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

export default EditProfileForm;
