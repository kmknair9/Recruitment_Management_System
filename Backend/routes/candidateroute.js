import express from "express";
import { getCandidates, getSingleCandidate, createCandidates, updateCandidate, deleteCandidate, getJobs, getSingleJob, createJob, updateJob, deleteJob } from "../controllers/controller.js";

const router = express.Router();

router.get("/", getCandidates);
router.get("/:id", getSingleCandidate);
router.post("/", createCandidates);
router.put("/:id", updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;