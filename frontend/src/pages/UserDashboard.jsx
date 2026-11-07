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
      .then(res => setComplaints(res.data.complaints))
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
      setSuccess('Complaint submitted')
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
    try {
      await api.delete(`/complaints/${id}`)
      fetchComplaints()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete')
    }
  }

  // helper to pick the right css class for status
  function statusClass(status) {
    if (status === 'open') return 'status-open'
    if (status === 'in-progress') return 'status-in-progress'
    if (status === 'resolved') return 'status-resolved'
    return ''
  }

  return (
    <div className="container">
      <div className="form-box">
        <h3>Raise a Complaint</h3>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
            <option value="wifi">WiFi</option>
            <option value="cleaning">Cleaning</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="btn-primary">Submit</button>
        </form>
      </div>

      <div className="form-box">
        <h3>My Complaints</h3>
        {complaints.length === 0 ? (
          <p className="no-data">No complaints yet</p>
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
                  <td>{c.title}</td>
                  <td>{c.category}</td>
                  <td>{c.priority}</td>
                  <td className={statusClass(c.status)}>{c.status}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
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
