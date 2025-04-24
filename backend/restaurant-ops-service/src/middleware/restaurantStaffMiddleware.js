module.exports = (req, res, next) => {
  if (req.user.role === 'restaurant-staff') {
    if (!req.user.restaurantId) {
      return res.status(403).json({
        error: 'Staff member not assigned to any restaurant'
      });
    }
    req.restaurantFilter = { restaurantId: req.user.restaurantId };
  }
  next();
};
