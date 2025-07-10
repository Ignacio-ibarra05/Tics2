import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function PruebaConexion() {
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase.from('usuarios').select('*')
      if (error) {
        setError('❌ Error al conectar con Supabase')
        console.error(error)
      } else {
        setUsuarios(data)
      }
    }

    fetchUsuarios()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Prueba de conexión con Supabase</h2>
      {error && <p className="text-red-600">{error}</p>}
      {!error && usuarios.length === 0 && <p>Conexión exitosa ✅ pero no hay usuarios registrados.</p>}
      {!error && usuarios.length > 0 && (
        <ul className="list-disc pl-5">
          {usuarios.map((user) => (
            <li key={user.id}>
              {user.nombre} ({user.username}) - Rol: {user.rol}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PruebaConexion
