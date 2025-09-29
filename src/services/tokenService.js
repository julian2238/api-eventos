const { db } = require("../firebase");
const bcrypt = require("bcrypt");

const ALLOWED_PLATFORMS = ["web", "movil"];

const saveRefreshToken = async (uid, refreshToken, platform) => {
	if (!ALLOWED_PLATFORMS.includes(platform)) {
		throw new Error("Plataforma no permitida.");
	}

	const createdAt = Date.now();
	const expiresAt = createdAt + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000;

	const hashedToken = await bcrypt.hash(refreshToken, 10);

	const tokenRef = db.collection("users").doc(uid).collection("tokens").doc(platform);

	await tokenRef.set({
		token: hashedToken,
		createdAt,
		expiresAt,
	});
};

const verifyRefreshToken = async (uid, refreshToken, platform) => {
	if (!ALLOWED_PLATFORMS.includes(platform)) {
		throw new Error("Plataforma no permitida.");
	}

	const tokenDocRef = db.collection("users").doc(uid).collection("tokens").doc(platform);
	const tokenDoc = await tokenDocRef.get();

	if (!tokenDoc.exists) return false;

	const data = tokenDoc.data();
	const isMatch = await bcrypt.compare(refreshToken, data.token);

	if (isMatch && data.expiresAt > Date.now()) {
		return true;
	}

	return false;
};

const revokeRefreshToken = async (uid, platform) => {
	const tokenDocRef = db.collection("users").doc(uid).collection("tokens").doc(platform);
	const tokenDoc = await tokenDocRef.get();

	if (!tokenDoc.exists) return false;

	await tokenDocRef.delete();

	return true;
};

const revokeAllRefreshTokens = async (uid) => {
	const tokensSnapshot = await db.collection("users").doc(uid).collection("tokens").get();

	if (tokensSnapshot.empty) return false;

	const batch = db.batch();

	tokensSnapshot.forEach((doc) => batch.delete(doc.ref));

	await batch.commit();

	return true;
};

module.exports = {
	saveRefreshToken,
	verifyRefreshToken,
	revokeRefreshToken,
	revokeAllRefreshTokens,
};
