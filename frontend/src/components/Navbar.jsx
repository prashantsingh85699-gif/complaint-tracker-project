import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="navbar">
      <h2>Complaint Tracker</h2>
      {user && (
        <div className="user-info">
          <span>{user.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
