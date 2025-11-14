import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService, MembershipsResponse, Membership } from '../services/admin.service'
import Header from '../components/Header'
import './Memberships.css'

interface MembershipsProps {
  onLogout: () => void
}

const Memberships = ({ onLogout }: MembershipsProps) => {
  const navigate = useNavigate()
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchMemberships()
  }, [pagination.page, statusFilter])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      const data = await adminService.getMemberships({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter || undefined
      })
      setMemberships(data.memberships)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar membresías')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await adminService.updateMembership(id, { status: newStatus })
      fetchMemberships()
      alert('Membresía actualizada exitosamente')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar membresía')
    }
  }

  const getMembershipName = (type: string) => {
    const names: Record<string, string> = {
      weekly: 'Semanal',
      monthly: 'Mensual',
      quarterly: 'Trimestral',
      semiannual: 'Semestral',
      annual: 'Anual'
    }
    return names[type] || type
  }

  return (
    <div className="memberships-container">
      <Header onLogout={onLogout} />
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <button onClick={() => navigate('/dashboard')} className="back-button">
              ← Dashboard
            </button>
            <h1>Gestión de Membresías</h1>
          </div>
        </div>
      </div>

      <main className="memberships-main">
        <div className="filter-section">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPagination(prev => ({ ...prev, page: 1 }))
            }}
            className="filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activa</option>
            <option value="expired">Expirada</option>
            <option value="cancelled">Cancelada</option>
            <option value="pending">Pendiente</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Cargando membresías...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="memberships-table">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Precio</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((membership) => (
                    <tr key={membership._id}>
                      <td>
                        {typeof membership.user === 'object'
                          ? membership.user.username
                          : 'N/A'}
                      </td>
                      <td>{getMembershipName(membership.type)}</td>
                      <td>
                        <span className={`status-badge ${membership.status}`}>
                          {membership.status}
                        </span>
                      </td>
                      <td>${membership.price.toLocaleString('es-AR')}</td>
                      <td>{new Date(membership.startDate).toLocaleDateString('es-AR')}</td>
                      <td>{new Date(membership.endDate).toLocaleDateString('es-AR')}</td>
                      <td>
                        <select
                          value={membership.status}
                          onChange={(e) => handleUpdateStatus(membership._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="active">Activa</option>
                          <option value="expired">Expirada</option>
                          <option value="cancelled">Cancelada</option>
                          <option value="pending">Pendiente</option>
                        </select>
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

export default Memberships

