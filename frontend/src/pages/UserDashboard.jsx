import { useState, useEffect } from 'react'
import api from '../utils/axios'

function UserDashboard() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('water')
  const [priority, setPriority] = useState('medium')
  const [complaints, setComplaints] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function fetchComplaints() {
    api.get('/complaints/my')
      .then(res => setComplaints(res.data.complaints || []))
      .catch(() => setError('Could not load complaints'))
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await api.post('/complaints', { title, description, category, priority })
      setSuccess('Complaint submitted successfully!')
      setTitle('')
      setDescription('')
      setCategory('water')
      setPriority('medium')
      fetchComplaints()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this open complaint?')) return
    try {
      await api.delete(`/complaints/${id}`)
      fetchComplaints()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete complaint')
    }
  }

  function statusBadge(status) {
    if (status === 'open') return 'badge badge-open'
    if (status === 'in-progress') return 'badge badge-in-progress'
    if (status === 'resolved') return 'badge badge-resolved'
    return 'badge'
  }

  function priorityClass(p) {
    if (p === 'high') return 'badge badge-high'
    if (p === 'medium') return 'badge badge-medium'
    return 'badge badge-low'
  }

  return (
    <div className="container">
      <div className="form-box">
        <h3>Raise a New Complaint</h3>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title (e.g. Water leak in Room 204)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="form-grid">
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="water">Water</option>
                <option value="electricity">Electricity</option>
                <option value="wifi">WiFi</option>
                <option value="cleaning">Cleaning</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Priority
              </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
            Submit Complaint
          </button>
        </form>
      </div>

      <div className="form-box">
        <h3>My Complaints History</h3>
        {complaints.length === 0 ? (
          <p className="no-data">You have not raised any complaints yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td><span className="category-tag">{c.category}</span></td>
                  <td><span className={priorityClass(c.priority)}>{c.priority}</span></td>
                  <td><span className={statusBadge(c.status)}>{c.status}</span></td>
                  <td style={{ color: '#64748b' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    {c.status === 'open' && (
                      <button className="btn-danger" onClick={() => handleDelete(c._id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
