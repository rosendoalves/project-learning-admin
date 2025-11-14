import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService, DashboardStats } from '../services/admin.service'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Header from '../components/Header'
import './Dashboard.css'

interface DashboardProps {
  onLogout: () => void
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await adminService.getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const COLORS = ['#1e3c72', '#2a5298', '#4a90e2', '#6bb3ff', '#8cc8ff']

  const membershipTypeNames: Record<string, string> = {
    weekly: 'Semanal',
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    semiannual: 'Semestral',
    annual: 'Anual'
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Cargando...
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error || 'Error al cargar estadísticas'}</div>
      </div>
    )
  }

  const chartData = stats.membershipsByType.map(item => ({
    name: membershipTypeNames[item._id] || item._id,
    cantidad: item.count
  }))

  return (
    <div className="dashboard-container">
      <Header onLogout={onLogout} />

      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.stats.totalUsers}</div>
              <div className="stat-label">Total Usuarios</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <div className="stat-value">{stats.stats.totalStudents}</div>
              <div className="stat-label">Estudiantes</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.stats.activeMemberships}</div>
              <div className="stat-label">Membresías Activas</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">${stats.stats.revenue.toLocaleString('es-AR')}</div>
              <div className="stat-label">Ingresos Totales</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.stats.totalPayments}</div>
              <div className="stat-label">Pagos Completados</div>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <h2>Membresías por Tipo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#1e3c72" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Distribución de Membresías</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-payments-section">
          <h2>Pagos Recientes</h2>
          <div className="payments-table">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      {typeof payment.user === 'object' 
                        ? payment.user.username 
                        : 'N/A'}
                    </td>
                    <td>${payment.amount.toLocaleString('es-AR')}</td>
                    <td>{payment.paymentMethod}</td>
                    <td>
                      <span className={`status-badge ${payment.status}`}>
                        {payment.status === 'completed' ? '✓ Completado' : payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.paymentDate 
                        ? new Date(payment.paymentDate).toLocaleDateString('es-AR')
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

