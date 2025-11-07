export const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const { rolId } = req.user;
    console.log(req.user)
    if (!allowedRoles.includes(rolId)) {
      return res
        .status(403)
        .json({ status: 403, error: 'No tiene permisos para acceder a este recurso.' });
    }

    next();
  };
};

