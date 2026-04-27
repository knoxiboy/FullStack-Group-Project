const express = require("express");
const { createJob, getJobs, getJobById, updateJob, deleteJob, acceptCandidate, rejectCandidate } = require("../../controllers/recruiter/jobController");
const auth = require("../../middleware/authMiddleware");

const router = express.Router();

// Apply protect middleware to all job routes
router.use(auth);

router.route("/").get(getJobs).post(createJob);

router.route("/:id").get(getJobById).put(updateJob).delete(deleteJob);

router.route("/:id/accept").put(acceptCandidate);

router.route("/:id/reject").put(rejectCandidate);

module.exports = router;
