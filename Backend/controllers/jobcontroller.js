import mongoose from "mongoose";
import Job from '../models/jobs.js';

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
