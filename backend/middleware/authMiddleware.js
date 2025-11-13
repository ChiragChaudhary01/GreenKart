import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies["Token"];
  if (!token) {
    return res.status(400).json({ error: "Access denied, no token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      user_id: decoded.user_id,
      role: decoded.role,
    };
    console.log("req.user_id, req.user.role", req.user.user_id, req.user.role);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Access denied, invalid token." });
  }
};

export default authMiddleware;
