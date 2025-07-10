import React from 'react';
import Navbar from './Navbar';

function Inicio({ user, onLogout }) {
  const galleryImages = [
    { id: 1, src: `${process.env.PUBLIC_URL}/img/gym1.jpg`, alt: 'Entrenamiento 1' },
    { id: 2, src: `${process.env.PUBLIC_URL}/img/gym2.jpg`, alt: 'Entrenamiento 2' },
    { id: 3, src: `${process.env.PUBLIC_URL}/img/gym3.jpg`, alt: 'Entrenamiento 3' },
  ];

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="inicio-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Bienvenido a nuestra aplicación</h2>
        </div>

        <div className="horizontal-gallery-container">
          <h3 className="text-2xl font-semibold mb-6 text-center">Nuestras Instalaciones</h3>
          <div className="horizontal-gallery">
            {galleryImages.map((image) => (
              <div key={image.id} className="horizontal-gallery-item">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="horizontal-gallery-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
