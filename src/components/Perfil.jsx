// Perfil.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import MedidasForm from './MedidasForm';
import EditProfileForm from './EditProfileForm'; 
import { supabase } from '../supabaseClient';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Perfil({ user, onLogout, onUpdateUser }) { 
  const [medidas, setMedidas] = useState([]);
  const [activeTab, setActiveTab] = useState('medidas');
  const [showMedidasForm, setShowMedidasForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        username: user.username || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchMedidas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('medidas')
          .select('*')
          .eq('id_usuario', user.id)
          .order('creado_en', { ascending: true });

        if (error) {
          console.error('❌ Error al cargar medidas:', error);
          setError('Error al cargar las medidas');
        } else {
          console.log('✅ Medidas cargadas:', data);
          setMedidas(data || []);
        }
      } catch (err) {
        console.error('❌ Error inesperado:', err);
        setError('Error inesperado al cargar medidas');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchMedidas();
    }
  }, [user?.id]);

  const handleAddMedidas = async (newMedidas) => {
    try {
      const nuevaEntrada = {
        ...newMedidas,
        id_usuario: user.id,
      };

      const { data, error } = await supabase
        .from('medidas')
        .insert([nuevaEntrada])
        .select();

      if (error) {
        console.error('❌ Error al guardar medidas:', error);
        setError('Error al guardar las medidas');
      } else {
        console.log('✅ Medida guardada:', data);
        setMedidas(prev => [...prev, ...data]);
        setShowMedidasForm(false);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Error inesperado al guardar:', err);
      setError('Error inesperado al guardar medidas');
    }
  };

  // handleSaveProfile ahora recibe la contraseña actual
  const handleSaveProfile = async (updatedProfileData, newPassword = '', currentPassword = '') => {
    try {
      setError(null); 
      setLoading(true); 

      let profileDataToUpdateGlobal = null; 

      // 1. Actualizar nombre y nombre de usuario en la tabla 'usuarios'
      let hasProfileChanges = false;
      if (updatedProfileData.name !== profileData.name || updatedProfileData.username !== profileData.username) {
        hasProfileChanges = true;
      }

      if (hasProfileChanges) {
        console.log('Datos de perfil intentando actualizar en tabla usuarios:', updatedProfileData);
        const { data, error: updateError } = await supabase
          .from('usuarios')
          .update({
            nombre: updatedProfileData.name,
            username: updatedProfileData.username
          })
          .eq('id', user.id)
          .select();

        if (updateError) {
          console.error('❌ Error al guardar el perfil:', updateError);
          setError(`Error al guardar el perfil: ${updateError.message}`);
          setLoading(false);
          return; 
        } else {
          console.log('✅ Perfil guardado en tabla usuarios:', data);
          setProfileData(data[0] || updatedProfileData);
          profileDataToUpdateGlobal = {
            name: updatedProfileData.name, 
            username: updatedProfileData.username,
          };
        }
      }

      // 2. Actualizar la contraseña si se proporcionó una nueva
      if (newPassword) {
        console.log('Intentando actualizar contraseña...');
        
        // --- Paso de reautenticación ---
        // Se requiere la contraseña actual para reautenticar al usuario
        // antes de permitir el cambio de contraseña.
        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email: user.email, // Usa el email del usuario para reautenticar
          password: currentPassword,
        });

        if (reauthError) {
          console.error('❌ Error de reautenticación:', reauthError);
          setError(`Error: La contraseña actual es incorrecta o la sesión ha caducado. ${reauthError.message}`);
          setLoading(false);
          return; // Detiene el proceso si la reautenticación falla
        }
        console.log('✅ Reautenticación exitosa.');
        // --- Fin de paso de reautenticación ---

        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (passwordError) {
          console.error('❌ Error al actualizar la contraseña:', passwordError);
          setError(`Error al actualizar la contraseña: ${passwordError.message}. Por seguridad, es posible que necesites volver a iniciar sesión.`);
          setLoading(false);
          return; 
        } else {
          console.log('✅ Contraseña actualizada exitosamente.');
          // Después de un cambio de contraseña exitoso, Supabase puede invalidar la sesión.
          // El usuario puede necesitar volver a iniciar sesión.
          // Opcional: onLogout(); para forzar el logout
        }
      }

      // Notificar a App.js si hubo cambios en el perfil (nombre/username)
      if (profileDataToUpdateGlobal && onUpdateUser) {
        onUpdateUser(profileDataToUpdateGlobal);
      }
      
      if (!hasProfileChanges && !newPassword) {
        setError('No se detectaron cambios para guardar.');
      } else {
        setShowEditProfileForm(false); 
        setError(null); 
      }

    } catch (err) {
      console.error('❌ Error inesperado al guardar el perfil:', err);
      setError('Error inesperado al guardar el perfil');
    } finally {
      setLoading(false); 
    }
  };

  const handleCancelEditProfile = () => {
    setShowEditProfileForm(false);
    setProfileData({
      name: user?.name || '',
      username: user?.username || '',
    });
  };

  const generateChartData = (campo, label) => {
    if (!medidas || medidas.length === 0) return { labels: [], datasets: [] };
    
    return {
      labels: medidas.map(item =>
        new Date(item.creado_en).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      ),
      datasets: [
        {
          label,
          data: medidas.map(item => parseFloat(item[campo]) || 0),
          borderColor: 'rgba(123, 31, 162, 1)',
          backgroundColor: 'rgba(123, 31, 162, 0.2)',
          tension: 0.3
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progreso de Medidas'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="profile-app">
      <Navbar user={user} onLogout={onLogout} />

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-banner" style={{ backgroundImage: 'linear-gradient(135deg, #7f00b2, #e100ff)' }}></div>

          <div className="profile-info">
            <div className="profile-avatar">
              {profileData.name.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="profile-details">
              <h1 className="profile-name">{profileData.name || 'Usuario'}</h1>
              <p className="profile-username">@{profileData.username || 'username'}</p>
            </div>

            <div className="profile-actions">
              {user?.role === 'admin' && <span className="badge-admin">ADMIN</span>}
              <button className="btn-edit-profile" onClick={() => setShowMedidasForm(!showMedidasForm)}>
                {showMedidasForm ? 'Cancelar Medidas' : 'Agregar Medidas'}
              </button>
              <button className="btn-edit-profile" onClick={() => setShowEditProfileForm(!showEditProfileForm)}>
                {showEditProfileForm ? 'Cancelar Edición' : 'Editar Perfil'}
              </button>
            </div>
          </div>
        </div>

        {showMedidasForm && (
          <div className="profile-card medidas-form-container">
            <MedidasForm onAddMedidas={handleAddMedidas} />
          </div>
        )}

        {showEditProfileForm && (
          <div className="profile-card edit-profile-form-container">
            <EditProfileForm
              initialData={profileData} 
              onSave={handleSaveProfile} // Asegúrate de que el onSave en EditProfileForm pase currentPassword
              onCancel={handleCancelEditProfile}
            />
          </div>
        )}

        {error && (
          <div className="profile-card error-message" style={{ backgroundColor: '#fee', color: '#c33', padding: '1rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'medidas' ? 'active' : ''}`} onClick={() => setActiveTab('medidas')}>
            Mis Medidas
          </button>
          <button className={`tab-btn ${activeTab === 'actividad' ? 'active' : ''}`} onClick={() => setActiveTab('actividad')}>
            Actividad
          </button>
          <button className={`tab-btn ${activeTab === 'sobre' ? 'active' : ''}`} onClick={() => setActiveTab('sobre')}>
            Sobre Mí
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'medidas' && (
            <div className="profile-card">
              <h2 className="section-title">Historial de Medidas</h2>

              {loading ? (
                <p className="loading-state">Cargando medidas...</p>
              ) : medidas.length === 0 ? (
                <p className="empty-state">No hay registros de medidas aún.</p>
              ) : (
                <>
                  <div className="medidas-grid">
                    {medidas.map((item, index) => (
                      <div key={item.id || index} className="medida-card hover-effect">
                        <div className="medida-header">
                          <span className="medida-date">
                            {new Date(item.creado_en).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="medida-details">
                          {item.altura && <div className="medida-item"><span className="medida-label">Altura</span><span className="medida-value">{item.altura} cm</span></div>}
                          {item.peso && <div className="medida-item"><span className="medida-label">Peso</span><span className="medida-value">{item.peso} kg</span></div>}
                          {item.brazo && <div className="medida-item"><span className="medida-label">Brazo</span><span className="medida-value">{item.brazo} cm</span></div>}
                          {item.piernas && <div className="medida-item"><span className="medida-label">Piernas</span><span className="medida-value">{item.piernas} cm</span></div>}
                          {item.cintura && <div className="medida-item"><span className="medida-label">Cintura</span><span className="medida-value">{item.cintura} cm</span></div>}
                          {item.abdomen && <div className="medida-item"><span className="medida-label">Abdomen</span><span className="medida-value">{item.abdomen} cm</span></div>}
                          {item.gemelo && <div className="medida-item"><span className="medida-label">Gemelo</span><span className="medida-value">{item.gemelo} cm</span></div>}
                          {item.espalda && <div className="medida-item"><span className="medida-label">Espalda</span><span className="medida-value">{item.espalda} cm</span></div>}
                          {item.torso && <div className="medida-item"><span className="medida-label">Torso</span><span className="medida-value">{item.torso} cm</span></div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {medidas.length > 1 && (
                    <div className="charts-section">
                      <h3>Gráficos de Progreso</h3>
                      <div className="charts-grid">
                        {medidas.some(m => m.peso) && (
                          <div className="chart-container">
                            <Line data={generateChartData('peso', 'Peso (kg)')} options={chartOptions} />
                          </div>
                        )}
                        {medidas.some(m => m.cintura) && (
                          <div className="chart-container">
                            <Line data={generateChartData('cintura', 'Cintura (cm)')} options={chartOptions} />
                          </div>
                        )}
                        {medidas.some(m => m.abdomen) && (
                          <div className="chart-container">
                            <Line data={generateChartData('abdomen', 'Abdomen (cm)')} options={chartOptions} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'actividad' && (
            <div className="profile-card">
              <h2 className="section-title">Actividad Reciente</h2>
              <div className="activity-list">
                <div className="activity-item"><div className="activity-icon">🏋️</div><div className="activity-content"><p>Completaste tu rutina de piernas hoy</p><span className="activity-time">Hace 2 horas</span></div></div>
                <div className="activity-item"><div className="activity-icon">💪</div><div className="activity-content"><p>Nuevo récord en press de banca: 80kg</p><span className="activity-time">Ayer</span></div></div>
                <div className="activity-item"><div className="activity-icon">📊</div><div className="activity-content"><p>Actualizaste tus medidas corporales</p><span className="activity-time">3 días atrás</span></div></div>
              </div>
            </div>
          )}

          {activeTab === 'sobre' && (
            <div className="profile-card">
              <h2 className="section-title">Sobre Mí</h2>
              <div className="about-section">
                <div className="about-item">
                  <h3 className="about-label">Información Básica</h3>
                  <p><strong>Nombre:</strong> {profileData.name || 'N/A'}</p>
                  <p><strong>Usuario:</strong> @{profileData.username || 'N/A'}</p>
                  <p><strong>Rol:</strong> {user?.role || 'N/A'}</p>
                  <p><strong>Miembro desde:</strong> Enero 2023</p>
                </div>
                
                <div className="about-item">
                  <h3 className="about-label">Objetivos Fitness</h3>
                  <p>🏆 Ganar masa muscular</p>
                  <p>💪 Aumentar fuerza en ejercicios compuestos</p>
                  <p>🏃‍♂️ Mejorar resistencia cardiovascular</p>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="about-item admin-features">
                    <h3 className="about-label">Privilegios de Administrador</h3>
                    <p>🔧 Puedes gestionar usuarios</p>
                    <p>📝 Puedes moderar contenido</p>
                    <p>⚙️ Tienes acceso al panel de administración</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;
