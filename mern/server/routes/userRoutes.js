const express = require("express");
const router = express.Router();

module.exports = router;

router.get('/api/user', (req, res) => {
    res.status(200).json({ message: "Get all users" });
});