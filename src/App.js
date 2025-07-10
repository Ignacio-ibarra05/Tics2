// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Inicio from './components/Inicio';
import Perfil from './components/Perfil';
import Blog from './components/Blog';
import AdminPanel from './components/AdminPanel';
import FileManagement from './components/FileManagement';
import UserFiles from './components/UserFiles';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Función para actualizar los datos del usuario en el estado global
  // Esta función es crucial para que los cambios en Perfil.jsx se reflejen en toda la aplicación
  const handleUpdateUser = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  return (
    <Router basename="/Tics2">
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Inicio user={user} onLogout={handleLogout} />} />
        
        {/* Login */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/perfil" /> : <Login onLogin={handleLogin} />} 
        />
        
        {/* Perfil del usuario - Ahora recibe onUpdateUser */}
        <Route 
          path="/perfil" 
          element={
            user ? 
              <Perfil user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : 
              <Navigate to="/login" />
          } 
        />
        
        {/*
          Ruta /settings:
          Si Perfil.jsx ya maneja la edición del perfil, esta ruta puede ser redundante.
          Sugiero redirigir a /perfil si tu intención es que el usuario edite su propio perfil
          desde la página de perfil. Si EditProfileForm fuera para editar otros usuarios (solo admin),
          entonces la lógica cambiaría. Por simplicidad, la redirigimos.
        */}
        <Route 
          path="/settings" 
          element={
            user ? 
              <Navigate to="/perfil" /> : // Redirigimos a /perfil donde se edita el perfil
              <Navigate to="/login" />
          } 
        />
        
        {/* Blog */}
        <Route 
          path="/blog" 
          element={
            user ? 
              <Blog user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
          } 
        />
        
        {/* Panel de administración (invitaciones) */}
        <Route 
          path="/admin" 
          element={
            user?.role === 'admin' ? 
              <AdminPanel user={user} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } 
        />
        
        {/* Gestión de archivos (admin) */}
        <Route 
          path="/file-management" 
          element={
            user?.role === 'admin' ? 
              <FileManagement user={user} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } 
        />
        
        {/* Archivos del usuario */}
        <Route 
          path="/my-files" 
          element={
            user ? 
              <UserFiles user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
          } 
        />
        
        {/* Ruta de fallback para páginas no encontradas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
