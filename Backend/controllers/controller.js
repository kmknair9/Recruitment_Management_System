import Candidate from "../models/candidate.js";
import mongoose from "mongoose";
import Job from '../models/jobs.js';
import Application from "../models/application.js";

export const getCandidates = async (req,res) => {

  try {
    const candidates = await Candidate.find({});
    res.status(200).json({ success: true, data: candidates });
  } catch(error) {
    console.error("Error in Finding Candidates:", error.message);
    res.status(500).json({ success: false, message: "Server Error"});
  } 

};

export const getSingleCandidate = async (req,res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Candidate Id"});
  }

  try {
    const candidate = await Candidate.findById(id);
    res.status(200).json({ success: true, data: candidate });
  } catch (error) {
    console.error('Error in Finding Candidate:', error.message);
    res.status(500).json({ success: false, message: "Server Error"});
  }
}

export const createCandidates = async (req,res) => {

  const candidate = req.body;

  if(!candidate.candidateId || !candidate.name || !candidate.email || !candidate.phoneNumber || !candidate.currentStatus || !candidate.resumeLink){
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const newCandidate = new Candidate(candidate);

  try {
    await newCandidate.save();
    res.status(201).json({ success: true, data: newCandidate });
  } catch(error) {
    console.error("Error in Creating new Candidate:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateCandidate = async (req,res) => {

  const { id } = req.params;

  const candidate = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Candidate Id"});
  }

  try{
    const updatedCandidate = await Candidate.findByIdAndUpdate(id, candidate, {new:true});
    res.status(200).json({ success: true, data: updatedCandidate });
  } catch(error) {
    console.error("Error in Updating Candidate:", error.message);
    res.status(500).json({ success:false, message: "Server Error" });
  }
};

export const deleteCandidate = async (req,res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid Object ID'});
  }

  try {
    await Candidate.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Candidate Deleted" });
  } catch(error) {
    console.error("Error in Deleting Candidate:", error.message);
    res.status(500).json({ success: false, message: "Server Error"});
  }
};

export const getJobs = async (req,res) => {

  try {
    const jobs = await Job.find({});
    res.status(200).json({ success: true, data: jobs});
  } catch (err) {
    console.error('Error Creating New Job:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error'});
  }

};

export const getSingleJob = async (req,res) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid Job Id'});
  }

  try {
      const job = await Job.findById(id);
      res.status(200).json({ success: true, data: job});
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error'});
  }
};

export const createJob = async (req,res) => {
  const job = req.body;

  if (!job.jobId || !job.title || !job.description || !job.requiredSkills || !job.recruiterId) {
    return res.status(400).json( {success: false, message: 'Please Fill All Fields'});
  }

  const newJob = new Job(job);

  try {
    await newJob.save();
    res.status(201).json({ success: true, data:newJob });
  } catch (err) {
    console.error('Error creating new Job:', err);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
};

export const updateJob = async (req,res) => {
  const { id } = req.params;

  const job = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid Job Id'});
    }

    try {
      const updatedJob = await Job.findByIdAndUpdate(id, job, {new: true});
      res.status(201).json({ success: true, data: updatedJob});
    } catch (err) {
      console.error('Error Updating Candidate:', err);
      res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const deleteJob = async (req,res) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({ success: false, message: 'Invalid Job ID'});
  }

  try {
    await Job.findByIdAndDelete(id);
    res.status(201).json({ success: true, message: 'Job Deleted Successfully'});
  } catch (err) {
    console.error('Error in Deleting Job:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error'});
  }
};

export const applyJob = async (req,res) => {
  const { id: jobId } = req.params;
  const  { candidateId }  = req.body;

  if (!candidateId) {
    return res.status(400).json({ success: false, message: 'Candidate ID is required'});
  }

  try {
    const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ success: false, message: 'Candidate Not Found'});
      }

    const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job Not Found'});
      }

    const alreadyApplied = await Application.findOne({ candidateId, jobId});
     if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Candidate already applied for this job'});
     }
    
    const newApplication = new Application({ candidateId, jobId });

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

    const candidates = applications.map( (app) => app.candidateId);
    res.status(200).json({ success: true, job: job.title, totalApplicants: candidates.length, candidates});
    
  } catch (err) {
    console.error("Error Fetching Job Applicants Details", err);
    return res.status(500).json({ success: false, message: 'Server Error'});
  }
  };
