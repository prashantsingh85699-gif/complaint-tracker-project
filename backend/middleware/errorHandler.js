const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Resource not found' });
  }

  // MongoDB connection / buffering error
  if (err.name === 'MongooseServerSelectionError' || err.message?.includes('buffering timed out')) {
    return res.status(503).json({
      message: 'Database connection failed. Please check MongoDB Atlas Network Access (allow 0.0.0.0/0).'
    });
  }

  // Everything else — don't leak sensitive internals
  res.status(500).json({ message: err.message || 'Server error' });
};

module.exports = errorHandler;
