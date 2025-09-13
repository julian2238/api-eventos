const { db } = require("../firebase");
const bcrypt = require("bcrypt");

const saveRefreshToken = async (uid, refreshToken) => {
	const createdAt = Date.now();
	const expiresAt = createdAt + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000;

	const hashedToken = await bcrypt.hash(refreshToken, 10);

	await db.collection("refreshTokens").add({
		uid,
		token: hashedToken,
		createdAt,
		expiresAt,
	});
};

const verifyRefreshToken = async (uid, refreshToken) => {
	const tokensSnapshot = await db.collection("refreshTokens").where("uid", "==", uid).get();

	if (tokensSnapshot.empty) return false;

	for (const tokenDoc of tokensSnapshot.docs) {
		const data = tokenDoc.data();
		const isMatch = await bcrypt.compare(refreshToken, data.token);

		if (isMatch && data.expiresAt > Date.now()) {
			return true;
		}
	}

	return false;
};

const revokeRefreshToken = async (uid, refreshToken) => {
	const tokensSnapshot = await db.collection("refreshTokens").where("uid", "==", uid).get();

	if (tokensSnapshot.empty) return false;

	for (const tokenDoc of tokensSnapshot.docs) {
		const data = tokenDoc.data();
		const isMatch = await bcrypt.compare(refreshToken, data.token);

		if (isMatch) {
			await tokenDoc.ref.delete();
			return true;
		}
	}

	return false;
};

const revokeAllRefreshTokens = async (uid) => {
	const tokensSnapshot = await db.collection("refreshTokens").where("uid", "==", uid).get();

	if (tokensSnapshot.empty) return false;

	const batch = db.batch();

	tokensSnapshot.docs.forEach((tokenDoc) => batch.delete(tokenDoc.ref));

	await batch.commit();

	return true;
};

module.exports = {
	saveRefreshToken,
	verifyRefreshToken,
	revokeRefreshToken,
	revokeAllRefreshTokens,
};
