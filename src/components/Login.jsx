import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error: fetchError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', username)
      .eq('contrasena', password)
      .single();

    if (fetchError || !data) {
      setError('Usuario o contraseña incorrectos');
    } else {
      onLogin({
        username: data.username,
        name: data.nombre,
        role: data.rol,
        id: data.id,
      });
      navigate('/perfil');
    }
  };

  return (
    <div>
      <Navbar isAuthenticated={false} />
      <div className="login-wrap flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl mb-4">Iniciar Sesión</h2>

        <form className="form bg-white p-6 rounded shadow-md w-80" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            name="un"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="pw"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#7f00b2] text-white font-semibold py-2 rounded hover:bg-[#6c009f]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Base de datos de usuarios
  const users = [
    { username: 'admin', password: '1234', role: 'admin', name: 'Administrador' },
    { username: 'cliente', password: '1234', role: 'cliente', name: 'Cliente Regular' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      onLogin({
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role
      });
      navigate('/perfil');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <Navbar isAuthenticated={false} />
      <div className="login-wrap flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl mb-4">Iniciar Sesión</h2>

        <form className="form bg-white p-6 rounded shadow-md w-80" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            name="un"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="pw"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#7f00b2] text-white font-semibold py-2 rounded hover:bg-[#6c009f]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

*/