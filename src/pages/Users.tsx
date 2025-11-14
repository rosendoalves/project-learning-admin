import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService, UsersResponse, User } from '../services/admin.service'
import Header from '../components/Header'
import './Users.css'

interface UsersProps {
  onLogout: () => void
}

const Users = ({ onLogout }: UsersProps) => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, search, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await adminService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search,
        role: roleFilter || undefined
      })
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      await adminService.deleteUser(id)
      fetchUsers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar usuario')
    }
  }

  return (
    <div className="users-container">
      <Header onLogout={onLogout} />
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <button onClick={() => navigate('/dashboard')} className="back-button">
              ← Dashboard
            </button>
            <h1>Gestión de Usuarios</h1>
          </div>
        </div>
      </div>

      <main className="users-main">
        <div className="users-actions">
          <div className="search-filters">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              className="search-input"
            />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              className="filter-select"
            >
              <option value="">Todos los roles</option>
              <option value="student">Estudiante</option>
              <option value="teacher">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button onClick={() => navigate('/users/new')} className="add-button">
            + Nuevo Usuario
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando usuarios...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Membresía</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email || 'N/A'}</td>
                      <td>{user.fullName || 'N/A'}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'student' ? 'Estudiante' : 
                           user.role === 'teacher' ? 'Profesor' : 'Admin'}
                        </span>
                      </td>
                      <td>
                        {user.hasActiveMembership ? (
                          <span className="membership-badge active">Activa</span>
                        ) : (
                          <span className="membership-badge inactive">Sin membresía</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => navigate(`/users/${user._id}`)}
                            className="edit-button"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="delete-button"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="page-button"
              >
                Anterior
              </button>
              <span>
                Página {pagination.page} de {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="page-button"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Users

