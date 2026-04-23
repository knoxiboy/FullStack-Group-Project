const express = require("express");
const { getJobMatches } = require("../controllers/matchController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all match routes
router.use(protect);

router.route("/:jobId").get(getJobMatches);

module.exports = router;
