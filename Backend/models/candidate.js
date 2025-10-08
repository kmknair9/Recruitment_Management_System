import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  candidateId:{
    type:String,
    required:true,
    unique:true
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
    required:true,
    enum:["Applied","Interviewing"]
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