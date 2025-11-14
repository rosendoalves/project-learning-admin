import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService, AIUsageStats } from '../services/admin.service'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Header from '../components/Header'
import './AIUsage.css'

interface AIUsageProps {
  onLogout: () => void
}

const AIUsage = ({ onLogout }: AIUsageProps) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AIUsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState(30)

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAIUsageStats(period)
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#1e3c72', '#2a5298', '#4a90e2', '#6bb3ff', '#8cc8ff', '#a8d5ff']

  const contentTypeNames: Record<string, string> = {
    syllabus: 'Temarios',
    topic: 'Temas',
    exercise: 'Ejercicios',
    explanation: 'Explicaciones',
    recommendation: 'Recomendaciones',
    grading: 'Correcciones'
  }

  if (loading) {
    return (
      <div className="ai-usage-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Cargando estadísticas de IA...
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="ai-usage-container">
        <div className="error-message">{error || 'Error al cargar estadísticas'}</div>
      </div>
    )
  }

  const contentTypeChartData = stats.byContentType.map(item => ({
    name: contentTypeNames[item._id] || item._id,
    count: item.count,
    tokens: item.totalTokens,
    usage: item.totalUsage
  }))

  const modelChartData = stats.byModel.map(item => ({
    name: item._id || 'Desconocido',
    count: item.count,
    tokens: item.totalTokens
  }))

  return (
    <div className="ai-usage-container">
      <Header onLogout={onLogout} />
      <div className="page-header">
        <div className="page-header-content">
          <h1>Monitoreo de Consumo OpenAI</h1>
          <div className="page-header-actions">
            <select 
              value={period} 
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="period-select"
            >
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={90}>Últimos 90 días</option>
              <option value={180}>Últimos 180 días</option>
            </select>
          </div>
        </div>
      </div>

      <main className="ai-usage-main">
        {/* Resumen General */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">📝</div>
            <div className="summary-content">
              <div className="summary-value">{stats.summary.totalContentGenerated}</div>
              <div className="summary-label">Contenidos Generados</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💡</div>
            <div className="summary-content">
              <div className="summary-value">{stats.summary.totalRecommendations}</div>
              <div className="summary-label">Recomendaciones</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🔢</div>
            <div className="summary-content">
              <div className="summary-value">{stats.summary.totalTokens.toLocaleString('es-AR')}</div>
              <div className="summary-label">Tokens Totales</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <div className="summary-value">${stats.summary.estimatedCostUSD.toFixed(2)}</div>
              <div className="summary-label">Costo Estimado (USD)</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⚡</div>
            <div className="summary-content">
              <div className="summary-value">{stats.summary.totalCacheHits}</div>
              <div className="summary-label">Cache Hits (Histórico)</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📈</div>
            <div className="summary-content">
              <div className="summary-value">{stats.summary.cacheHitRate}%</div>
              <div className="summary-label">Tasa de Cache (Histórico)</div>
            </div>
          </div>
        </div>

        {/* Estadísticas en Tiempo Real */}
        <div className="realtime-stats-section">
          <h2>📊 Estadísticas en Tiempo Real</h2>
          <div className="realtime-stats-grid">
            <div className="realtime-stat-card">
              <div className="realtime-stat-icon">✅</div>
              <div className="realtime-stat-content">
                <div className="realtime-stat-value">{stats.realTimeStats.cacheHits}</div>
                <div className="realtime-stat-label">Cache Hits (Desde último reinicio)</div>
              </div>
            </div>
            <div className="realtime-stat-card">
              <div className="realtime-stat-icon">🔄</div>
              <div className="realtime-stat-content">
                <div className="realtime-stat-value">{stats.realTimeStats.apiCalls}</div>
                <div className="realtime-stat-label">Llamadas a OpenAI API</div>
              </div>
            </div>
            <div className="realtime-stat-card highlight">
              <div className="realtime-stat-icon">📊</div>
              <div className="realtime-stat-content">
                <div className="realtime-stat-value">{stats.realTimeStats.cacheHitRate}%</div>
                <div className="realtime-stat-label">Tasa de Cache Hit (Tiempo Real)</div>
              </div>
            </div>
            <div className="realtime-stat-card">
              <div className="realtime-stat-icon">🕐</div>
              <div className="realtime-stat-content">
                <div className="realtime-stat-value">
                  {new Date(stats.realTimeStats.lastReset).toLocaleString('es-AR')}
                </div>
                <div className="realtime-stat-label">Último Reinicio de Estadísticas</div>
              </div>
            </div>
          </div>
          <div className="realtime-stats-info">
            <p>💡 <strong>Nota:</strong> Estas estadísticas se reinician cuando el servidor se reinicia. 
            Muestran el uso real de cache vs llamadas a la API de OpenAI desde el último inicio del servidor.</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="charts-section">
          <div className="chart-card">
            <h2>Consumo Diario de Tokens</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tokens" stroke="#1e3c72" strokeWidth={2} name="Tokens" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Contenidos Generados por Tipo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentTypeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1e3c72" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Distribución por Modelo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={modelChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {modelChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Tokens por Tipo de Contenido</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentTypeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tokens" fill="#4a90e2" name="Tokens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estadísticas de Cache */}
        <div className="cache-stats-section">
          <h2>Estadísticas de Cache</h2>
          <div className="cache-stats-grid">
            <div className="cache-stat-card">
              <div className="cache-stat-label">Total Generado</div>
              <div className="cache-stat-value">{stats.cacheStats.totalGenerated}</div>
            </div>
            <div className="cache-stat-card">
              <div className="cache-stat-label">Total Cache Hits</div>
              <div className="cache-stat-value">{stats.cacheStats.totalCacheHits}</div>
            </div>
            <div className="cache-stat-card">
              <div className="cache-stat-label">Uso Promedio por Item</div>
              <div className="cache-stat-value">{stats.cacheStats.avgUsagePerItem.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Tabla Detallada */}
        <div className="detailed-table-section">
          <h2>Desglose por Tipo de Contenido</h2>
          <div className="detailed-table">
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Tokens Totales</th>
                  <th>Tokens Promedio</th>
                  <th>Uso Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.byContentType.map((item) => (
                  <tr key={item._id}>
                    <td>{contentTypeNames[item._id] || item._id}</td>
                    <td>{item.count}</td>
                    <td>{item.totalTokens.toLocaleString('es-AR')}</td>
                    <td>{item.avgTokens.toFixed(0)}</td>
                    <td>{item.totalUsage}</td>
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

export default AIUsage

