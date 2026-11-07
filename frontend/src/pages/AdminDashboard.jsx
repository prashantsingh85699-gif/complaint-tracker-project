import { useState, useEffect } from 'react'
import api from '../utils/axios'

function AdminDashboard() {
  const [complaints, setComplaints] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')

  function fetchComplaints() {
    const params = { page }
    if (statusFilter !== 'all') params.status = statusFilter
    if (categoryFilter !== 'all') params.category = categoryFilter
    if (priorityFilter !== 'all') params.priority = priorityFilter

    api.get('/complaints', { params })
      .then(res => {
        setComplaints(res.data.complaints)
        setTotalPages(res.data.pages || 1)
      })
      .catch(() => setError('Could not load complaints'))
  }

  useEffect(() => {
    fetchComplaints()
  }, [page, statusFilter, categoryFilter, priorityFilter])

  function handleFilter() {
    setPage(1)
    // useEffect will re-fetch because page or filters changed
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await api.patch(`/complaints/${id}/status`, { status: newStatus })
      fetchComplaints()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  function statusClass(status) {
    if (status === 'open') return 'status-open'
    if (status === 'in-progress') return 'status-in-progress'
    if (status === 'resolved') return 'status-resolved'
    return ''
  }

  // cut long descriptions
  function truncate(text, len = 50) {
    if (!text) return ''
    return text.length > len ? text.slice(0, len) + '...' : text
  }

  return (
    <div className="container">
      <div className="form-box">
        <h3>All Complaints</h3>
        {error && <p className="error-msg">{error}</p>}

        <div className="filter-bar">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
            <option value="wifi">WiFi</option>
            <option value="cleaning">Cleaning</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button className="btn-primary" onClick={handleFilter}>Filter</button>
        </div>

        {complaints.length === 0 ? (
          <p className="no-data">No complaints found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td>{truncate(c.description)}</td>
                  <td>{c.category}</td>
                  <td>{c.priority}</td>
                  <td className={statusClass(c.status)}>{c.status}</td>
                  <td>{c.createdBy?.name || 'Unknown'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      style={{ width: 'auto', marginBottom: 0 }}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button
            className="btn-primary"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="btn-primary"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
