import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import UserProfileModal from './UserProfileModal'
import './Header.css'

interface HeaderProps {
  onLogout: () => void
}

const Header = ({ onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const user = authService.getUser()
  const userName = user?.fullName || user?.username || 'Administrador'
  const userEmail = user?.email || ''

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleViewProfile = () => {
    setIsMenuOpen(false)
    setIsProfileModalOpen(true)
  }

  const handleLogout = () => {
    setIsMenuOpen(false)
    onLogout()
  }

  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="logo-container">
          <h1>Panel Administrador</h1>
        </div>
        
        <div className="header-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-button">
            📊 Dashboard
          </button>
          <button onClick={() => navigate('/users')} className="nav-button">
            👥 Usuarios
          </button>
          <button onClick={() => navigate('/memberships')} className="nav-button">
            💳 Membresías
          </button>
          <button onClick={() => navigate('/ai-usage')} className="nav-button">
            🤖 Consumo IA
          </button>
        </div>

        <div className="user-section" ref={menuRef}>
          <button 
            className="user-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú de usuario"
          >
            <div className="user-avatar">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1e3c72&color=fff&size=128`} 
                alt={userName}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (!parent) return
                  // Verificar si ya existe un fallback
                  const existingFallback = parent.querySelector('.avatar-fallback')
                  if (existingFallback) return
                  const fallback = document.createElement('div')
                  fallback.className = 'avatar-fallback'
                  fallback.textContent = userName.charAt(0).toUpperCase()
                  parent.appendChild(fallback)
                }}
              />
            </div>
            <span className="user-name">{userName}</span>
            <span className={`menu-arrow ${isMenuOpen ? 'open' : ''}`}>▼</span>
          </button>

          {isMenuOpen && (
            <div className="user-dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1e3c72&color=fff&size=128`} 
                    alt={userName}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      if (target.nextSibling) return
                      const fallback = document.createElement('div')
                      fallback.className = 'avatar-fallback'
                      fallback.textContent = userName.charAt(0).toUpperCase()
                      target.parentElement?.appendChild(fallback)
                    }}
                  />
                  <div className="avatar-fallback" style={{ display: 'none' }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">{userName}</div>
                  <div className="dropdown-user-email">{userEmail || user?.username}</div>
                  <div className="dropdown-user-role">Administrador</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleViewProfile}>
                <span className="dropdown-icon">👤</span>
                <span>Ver Datos</span>
              </button>
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <span className="dropdown-icon">🚪</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user || {}}
      />
    </header>
  )
}

export default Header

