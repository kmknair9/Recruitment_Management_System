import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  }
  },{
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;