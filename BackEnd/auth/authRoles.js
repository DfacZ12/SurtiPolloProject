export const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const { rol } = req.user;

    if (!allowedRoles.includes(rol)) {
      return res
        .status(403)
        .json({ status: 403, error: 'No tiene permisos para acceder a este recurso.' });
    }

    next();
  };
};

