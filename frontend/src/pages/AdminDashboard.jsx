import { useState, useEffect } from 'react'
import api from '../utils/axios'

function AdminDashboard() {
  const [complaints, setComplaints] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalComplaints, setTotalComplaints] = useState(0)
  const [error, setError] = useState('')

  function fetchComplaints() {
    const params = { page }
    if (statusFilter !== 'all') params.status = statusFilter
    if (categoryFilter !== 'all') params.category = categoryFilter
    if (priorityFilter !== 'all') params.priority = priorityFilter

    api.get('/complaints', { params })
      .then(res => {
        setComplaints(res.data.complaints || [])
        setTotalPages(res.data.pages || 1)
        setTotalComplaints(res.data.total || (res.data.complaints ? res.data.complaints.length : 0))
      })
      .catch(() => setError('Could not load complaints'))
  }

  useEffect(() => {
    fetchComplaints()
  }, [page, statusFilter, categoryFilter, priorityFilter])

  function handleReset() {
    setStatusFilter('all')
    setCategoryFilter('all')
    setPriorityFilter('all')
    setPage(1)
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await api.patch(`/complaints/${id}/status`, { status: newStatus })
      fetchComplaints()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  // Quick stats computed from current list
  const openCount = complaints.filter(c => c.status === 'open').length
  const inProgressCount = complaints.filter(c => c.status === 'in-progress').length
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length

  function priorityClass(p) {
    if (p === 'high') return 'badge badge-high'
    if (p === 'medium') return 'badge badge-medium'
    return 'badge badge-low'
  }

  function truncate(text, len = 60) {
    if (!text) return ''
    return text.length > len ? text.slice(0, len) + '...' : text
  }

  return (
    <div className="container">
      {/* Admin Stat Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Complaints</span>
          <span className="stat-value">{totalComplaints}</span>
        </div>
        <div className="stat-card stat-open">
          <span className="stat-label">Open</span>
          <span className="stat-value">{openCount}</span>
        </div>
        <div className="stat-card stat-in-progress">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{inProgressCount}</span>
        </div>
        <div className="stat-card stat-resolved">
          <span className="stat-label">Resolved</span>
          <span className="stat-value">{resolvedCount}</span>
        </div>
      </div>

      <div className="form-box">
        <h3>Complaints Management</h3>
        {error && <p className="error-msg">{error}</p>}

        {/* Structured Filter Bar */}
        <div className="filter-bar">
          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
              <option value="all">All Categories</option>
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="wifi">WiFi</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}>
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button type="button" className="btn-secondary" onClick={handleReset}>
            Reset Filters
          </button>
        </div>

        {/* Complaints Table */}
        {complaints.length === 0 ? (
          <p className="no-data">No complaints match the selected filters.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status (Change)</th>
                <th>Created By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td style={{ color: '#475569' }}>{truncate(c.description)}</td>
                  <td><span className="category-tag">{c.category}</span></td>
                  <td><span className={priorityClass(c.priority)}>{c.priority}</span></td>
                  <td>
                    <select
                      className={`status-select ${c.status === 'open' ? 'badge-open' : c.status === 'in-progress' ? 'badge-in-progress' : 'badge-resolved'}`}
                      value={c.status}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td>{c.createdBy?.name || 'Unknown'}</td>
                  <td style={{ color: '#64748b' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
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
