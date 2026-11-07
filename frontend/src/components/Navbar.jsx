import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-logo">CT</div>
        <h2>Complaint Tracker</h2>
        {user && <span className="nav-role-badge">{user.role}</span>}
      </div>
      {user && (
        <div className="user-info">
          <span className="user-avatar" title={user.name}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </span>
          <span className="user-name">{user.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
