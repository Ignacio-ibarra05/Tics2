import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="nav flex items-center justify-between px-6 py-4 bg-[#7f00b2]">
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <img 
            className='logo h-10 hover:opacity-90 transition-opacity duration-200' 
            src="public/img/logoo.png" 
            alt='logo' 
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="text-white px-4 py-2 rounded-lg border border-transparent hover:bg-white hover:text-[#7f00b2] transition-all duration-300"
          >
            Inicio
          </Link>
          
          {user && (
            <>
              <Link 
                to="/blog" 
                className="text-white px-4 py-2 rounded-lg border border-transparent hover:bg-white hover:text-[#7f00b2] transition-all duration-300"
              >
                Blog
              </Link>
              <Link 
                to="/perfil" 
                className="text-white px-4 py-2 rounded-lg border border-transparent hover:bg-white hover:text-[#7f00b2] transition-all duration-300"
              >
                Perfil
              </Link>
              <Link 
                to="/my-files" 
                className="text-white px-4 py-2 rounded-lg border border-transparent hover:bg-white hover:text-[#7f00b2] transition-all duration-300"
              >
                Mis Archivos
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link 
                    to="/admin" 
                    className="text-white px-4 py-2 rounded-lg border border-transparent hover:bg-white hover:text-[#7f00b2] transition-all duration-300"
                  >
                    Invitar
                  </Link>
                  <Link 
                    to="/file-management" 
                    className="text-white px-4 py-2 rounded-lg border border-transparent hover:bg-white hover:text-[#7f00b2] transition-all duration-300"
                  >
                    Archivos
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-white">Hola, {user.name}</span>
          <button
            onClick={() => {
              onLogout();
              navigate('/');
            }}
            className="text-white px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-[#7f00b2] transition-all duration-300"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <Link 
          to="/login" 
          className="text-white px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-[#7f00b2] transition-all duration-300"
        >
          Iniciar sesión
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
