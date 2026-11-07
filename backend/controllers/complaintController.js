const Complaint = require('../models/Complaint');

const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;
    const complaint = await Complaint.create({
      title, description, category, priority,
      createdBy: req.user._id
    });
    res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
};

const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.status(200).json({ complaints });
  } catch (err) {
    next(err);
  }
};

const getAllComplaints = async (req, res, next) => {
  try {
    // Build filter from query params
    const filter = {};
    if (req.query.status) filter.status = String(req.query.status);
    if (req.query.category) filter.category = String(req.query.category);
    if (req.query.priority) filter.priority = String(req.query.priority);

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 50) limit = 50;
    const skip = (page - 1) * limit;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.status(200).json({
      complaints,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (err) {
    next(err);
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Only the owner can delete
    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    // Can only delete open complaints
    if (complaint.status !== 'open') {
      return res.status(400).json({ message: 'Can only delete complaints with open status' });
    }

    await complaint.deleteOne();
    res.status(200).json({ message: 'Complaint deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createComplaint, getMyComplaints, getAllComplaints, updateStatus, deleteComplaint };
