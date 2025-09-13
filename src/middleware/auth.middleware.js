const jwtUtils = require("../utils/jwt.utils");

const validarJWT = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

	if (!token) {
		return res.status(401).send({
			status: false,
			message: "No se ha proporcionado un token de autenticación",
		});
	}

	try {
		const decoded = jwtUtils.verifyToken(token);
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ status: false, message: "Token Expirado" });
		}
		return res.status(401).json({ status: false, message: "Token Inválido" });
	}
};

const checkRole = (roles) => {
	return (req, res, next) => {
		if (roles.includes(req.user.role)) return next();

		return res.status(403).json({ status: false, message: "No autorizado" });
	};
};

module.exports = {
	validarJWT,
	checkRole,
};
