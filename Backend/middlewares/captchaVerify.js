// server/middleware/captchaVerify.js
const axios = require('axios');

module.exports = async function captchaVerify(req, res, next) {
  try {
    const { captchaToken } = req.body || {};
    if (!captchaToken) {
      return res.status(400).json({ error: "Captcha token missing" });
    }

    const secret = process.env.HCAPTCHA_SECRET;

    // If you have the secret, verify with hCaptcha.
    if (secret && secret.trim().length > 0) {
      const verifyRes = await axios.post(
        'https://hcaptcha.com/siteverify',
        new URLSearchParams({ secret, response: captchaToken }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (!verifyRes.data?.success) {
        return res.status(400).json({
          error: "Captcha verification failed",
          details: verifyRes.data
        });
      }
    } else {
      // No secret available → pass-through mode.
      // We'll forward the captcha token to the college API later in the route.
      // (Nothing to do here.)
    }

    return next();
  } catch (err) {
    console.error("Captcha verify error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Captcha verification error" });
  }
};
