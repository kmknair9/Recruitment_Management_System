import express from 'express';
import { applyJob, getJobApplicants } from '../controllers/controller.js';

const router = express.Router();

router.post('/:id/apply', applyJob);
router.get('/:id/applicants', getJobApplicants);


export default router;
