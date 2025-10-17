import Candidate from "../models/candidate.js";
import Job from '../models/jobs.js';
import Application from "../models/application.js";

export const applyJob = async (req,res) => {
  const { id: jobId } = req.params;
  const { userId, currentStatus }  = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Candidate ID is required'});
  }
  try {
    const candidate = await Candidate.findOne({ userId });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate Not Found'});
    } else {
        await Candidate.findOneAndUpdate({ userId }, { currentStatus: currentStatus}, { new: true });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job Not Found'});
    }
    const alreadyApplied = await Application.findOne({ candidateId: candidate._id, jobId});
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Already applied'});
    }
    const newApplication = new Application({ candidateId: candidate._id, jobId });
    await newApplication.save();
    res.status(201).json({ success: true, data: newApplication, message: 'Applied to Job sucessfully'});
  } catch (err) {
      console.error('Error applying for job', err.message);
      res.status(500).json({ success: false, message: "Server Error"});
  }
};

export const getJobApplicants =  async (req,res) => {
  const { id:jobId } = req.params;
  if (!jobId) {
    return res.status(400).json({ success: false, message: 'Job ID is required'});
  }
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job Not Found'});
    }
    const applications = await Application.find({ jobId }).populate('candidateId');
    const candidates = applications
      .map( (app) => app.candidateId)
      .filter(candidate => candidate !== null);
    res.status(200).json({ success: true, job: job.title, totalApplicants: candidates.length, candidates});
  } catch (err) {
      console.error("Error Fetching Job Applicants Details", err);
      return res.status(500).json({ success: false, message: 'Server Error'});
  }
};
