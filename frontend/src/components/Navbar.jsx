import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <header className="navbar">
      <div className="nav-brand">
        <h2>Hostel Complaint Portal</h2>
        <span className="nav-tagline">Campus Facility Management</span>
      </div>
      {user ? (
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
            {user.role}
          </span>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      ) : (
        <div className="nav-guest">
          <span>Student & Staff Portal</span>
        </div>
      )}
    </header>
  )
}

export default Navbar
