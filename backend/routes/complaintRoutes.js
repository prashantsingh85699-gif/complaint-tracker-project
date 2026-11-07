const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateStatus,
  deleteComplaint
} = require('../controllers/complaintController');

router.post('/', protect, authorize('user'), createComplaint);
router.get('/my', protect, authorize('user'), getMyComplaints);
router.get('/', protect, authorize('admin'), getAllComplaints);
router.patch('/:id/status', protect, authorize('admin'), updateStatus);
router.delete('/:id', protect, authorize('user'), deleteComplaint);

module.exports = router;
