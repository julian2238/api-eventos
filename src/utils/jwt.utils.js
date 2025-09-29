const jwt = require("jsonwebtoken");

/**
 * Generate an access token for a user.
 * @param {string} uid
 * @param {string} role
 * @returns {string} The generated access token.
 */
const generateAccessToken = (uid, role, platform) => {
	return jwt.sign({ uid, role, platform }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * Generate a refresh token for a user.
 * @param {string} uid
 * @param {string} role
 * @returns {string} The generated refresh token.
 */
const generateRefreshToken = (uid, role, platform) => {
	return jwt.sign({ uid, role, platform }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Verify a JWT token.
 * @param {string} token
 * @returns { Object } The decoded token payload.
 */
const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	verifyToken,
};
