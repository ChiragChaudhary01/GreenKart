const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      if (!allowedRoles.includes(req.user.role))
        return res.status(403).json({ error: "Forbidden: Access denied" });

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };
};

export default roleMiddleware;
