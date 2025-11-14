import './UserProfileModal.css'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    fullName?: string
    username?: string
    email?: string
    role?: string
  }
}

const UserProfileModal = ({ isOpen, onClose, user }: UserProfileModalProps) => {
  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
      >
        <div className="modal-header">
          <h2 id="modal-title">Perfil de Administrador</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="profile-avatar-large">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username || 'Admin')}&background=1e3c72&color=fff&size=200`} 
              alt={user.fullName || user.username}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                if (target.nextSibling) return
                const fallback = document.createElement('div')
                fallback.className = 'avatar-fallback-large'
                fallback.textContent = (user.fullName || user.username || 'A').charAt(0).toUpperCase()
                target.parentElement?.appendChild(fallback)
              }}
            />
          </div>

          <div className="profile-info">
            <div className="info-item">
              <label>Nombre completo:</label>
              <span>{user.fullName || 'No especificado'}</span>
            </div>
            <div className="info-item">
              <label>Usuario:</label>
              <span>{user.username || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email || 'No especificado'}</span>
            </div>
            <div className="info-item">
              <label>Rol:</label>
              <span className="role-badge admin-badge">Administrador</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfileModal

