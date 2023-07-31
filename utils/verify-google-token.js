const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const gClient = new OAuth2Client(GOOGLE_CLIENT_ID);

module.exports.verifyGoogleToken = async (token) => {
  try {
    const ticket = await gClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    console.log({ errorMessage: error.message });
    return { error: "Invalid user detected. Please try again" };
  }
};
