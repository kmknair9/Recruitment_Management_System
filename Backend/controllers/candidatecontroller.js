import Candidate from "../models/candidate.js";
import mongoose from "mongoose";

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
};

export const createCandidates = async (req,res) => {
  const {type, userId, name, email, phoneNumber, currentStatus, resumeLink } = req.body;
    if(!type || !userId || !name || !email || !phoneNumber || !currentStatus || !resumeLink){
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }
    if (type === 'candidate') {
      const existingCandidate = await Candidate.findOne({ userId });
        if (existingCandidate) {
          return res.status(400).json({message: 'Already filled'});
        }
    }
  try {
    const newCandidate = new Candidate({type, userId, name, email, phoneNumber, currentStatus, resumeLink });
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
  try {
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
