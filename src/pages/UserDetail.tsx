import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminService } from '../services/admin.service'
import Header from '../components/Header'
import './UserDetail.css'

interface UserDetailProps {
  onLogout: () => void
}

const UserDetail = ({ onLogout }: UserDetailProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [memberships, setMemberships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'student',
    password: ''
  })

  useEffect(() => {
    if (id) {
      fetchUser()
    }
  }, [id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const data = await adminService.getUserById(id!)
      setUser(data.user)
      setMemberships(data.memberships)
      setFormData({
        email: data.user.email || '',
        fullName: data.user.fullName || '',
        role: data.user.role,
        password: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      await adminService.updateUser(id!, formData)
      setEditing(false)
      fetchUser()
      alert('Usuario actualizado exitosamente')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar usuario')
    }
  }

  if (loading) {
    return (
      <div className="user-detail-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Cargando...
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="user-detail-container">
        <div className="error-message">{error || 'Usuario no encontrado'}</div>
        <button onClick={() => navigate('/users')} className="back-button">
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="user-detail-container">
      <Header onLogout={onLogout} />
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <button onClick={() => navigate('/users')} className="back-button">
              ← Volver
            </button>
            <h1>Detalle de Usuario</h1>
          </div>
        </div>
      </div>

      <main className="user-detail-main">
        <div className="user-info-card">
          <h2>Información del Usuario</h2>
          {!editing ? (
            <div className="user-info">
              <div className="info-row">
                <label>Usuario:</label>
                <span>{user.username}</span>
              </div>
              <div className="info-row">
                <label>Email:</label>
                <span>{user.email || 'N/A'}</span>
              </div>
              <div className="info-row">
                <label>Nombre:</label>
                <span>{user.fullName || 'N/A'}</span>
              </div>
              <div className="info-row">
                <label>Rol:</label>
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'student' ? 'Estudiante' : 
                   user.role === 'teacher' ? 'Profesor' : 'Admin'}
                </span>
              </div>
              <div className="info-row">
                <label>Membresía:</label>
                <span>
                  {user.hasActiveMembership ? (
                    <span className="membership-badge active">Activa</span>
                  ) : (
                    <span className="membership-badge inactive">Sin membresía</span>
                  )}
                </span>
              </div>
              <button onClick={() => setEditing(true)} className="edit-button">
                Editar Usuario
              </button>
            </div>
          ) : (
            <div className="edit-form">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="student">Estudiante</option>
                  <option value="teacher">Profesor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nueva Contraseña (opcional):</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Dejar vacío para no cambiar"
                />
              </div>
              <div className="form-actions">
                <button onClick={handleUpdate} className="save-button">
                  Guardar
                </button>
                <button onClick={() => {
                  setEditing(false)
                  fetchUser()
                }} className="cancel-button">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="memberships-card">
          <h2>Historial de Membresías</h2>
          {memberships.length === 0 ? (
            <p>No hay membresías registradas</p>
          ) : (
            <div className="memberships-list">
              {memberships.map((membership) => (
                <div key={membership._id} className="membership-item">
                  <div className="membership-header">
                    <span className="membership-type">{membership.type}</span>
                    <span className={`status-badge ${membership.status}`}>
                      {membership.status}
                    </span>
                  </div>
                  <div className="membership-details">
                    <p>Precio: ${membership.price.toLocaleString('es-AR')}</p>
                    <p>Inicio: {new Date(membership.startDate).toLocaleDateString('es-AR')}</p>
                    <p>Fin: {new Date(membership.endDate).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default UserDetail

