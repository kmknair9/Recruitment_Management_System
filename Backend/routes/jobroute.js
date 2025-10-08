import express from 'express';
import { getJobs, getSingleJob, createJob, updateJob, deleteJob} from '../controllers/controller.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getSingleJob);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;