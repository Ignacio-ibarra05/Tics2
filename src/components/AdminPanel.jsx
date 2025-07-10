import React, { useState } from 'react'
import Navbar from './Navbar'
import { supabase } from '../supabaseClient'
import emailjs from 'emailjs-com'

// ⚙️ Claves leídas desde variables de entorno (usadas como secretos en GitHub o localmente)
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY

// 🔐 Generador de contraseña aleatoria segura
function generateRandomPassword(length = 10) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('')
}

function AdminPanel({ user, onLogout }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)

    const username = email.split('@')[0]
    const password = generateRandomPassword()

    // Crear usuario en Supabase
    const { error } = await supabase.from('usuarios').insert([
      {
        correo: email,
        username,
        contrasena: password,
        rol: 'cliente',
        nombre: username,
        foto_perfil: null
      }
    ])

    if (error) {
      setMessage(`❌ Error al crear usuario: ${error.message}`)
    } else {
      setMessage(`✅ Usuario creado correctamente para ${email}`)

      // Enviar correo con EmailJS
      const templateParams = {
        to_email: email,
        username,
        password,
        link: 'https://ignacio-ibarra05.github.io/Tics2/login'
      }

      try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        console.log('✅ Correo enviado exitosamente')
      } catch (emailError) {
        console.error('❌ Error al enviar correo:', emailError)
        const errorMsg = emailError?.text || emailError?.message || JSON.stringify(emailError)
        setMessage(`⚠️ Usuario creado, pero no se pudo enviar el correo: ${errorMsg}`)
      }
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

export default AdminPanel;
