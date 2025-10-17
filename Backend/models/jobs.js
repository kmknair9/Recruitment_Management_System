import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: String,
    required: true
  },
  recruiterId: {
    type: String,
    required: true
  }
  },{
    timestamps:true
});

const Job = mongoose.model('Job', jobSchema);

export default Job;