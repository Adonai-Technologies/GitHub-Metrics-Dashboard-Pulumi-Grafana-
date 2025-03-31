require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 4000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Middleware to parse GitHub webhook payloads
app.use(bodyParser.json());

// Verify GitHub signature
function verifySignature(req, res, next) {
    const signature = req.headers["x-hub-signature-256"];
    if (!signature) {
        return res.status(401).send("Signature required");
    }

    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    const digest = `sha256=${hmac.update(JSON.stringify(req.body)).digest("hex")}`;

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        next();
    } else {
        return res.status(401).send("Invalid signature");
    }
}

// GitHub webhook endpoint
app.post("/github-webhook", (req, res) => {
    console.log("🔹 Received GitHub event:", req.body);
    res.status(200).send("Event received");
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Webhook receiver running on http://localhost:${PORT}/github-webhook`);
});
