import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type:{
    type:String,
    enum: ['others','candidate'],
    required: true
  },
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  phoneNumber:{
    type:String,
    required:true
  },
  currentStatus:{
    type:String,
    enum:[" ","Applied","Interviewing"]
  },
  resumeLink:{
    type:String,
    required:true
  }
  }, {
    timestamps:true
});

const Candidate = mongoose.model('Candidate',candidateSchema);

export default Candidate;