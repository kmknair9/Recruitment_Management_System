import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin','Recruiter','HiringManager'],
    required: true
  }
},{
  timestamps: true
});

userSchema.methods.setPassword = async function (password) {
 const saltRounds = 12;
 this.passwordHash = await bcrypt.hash(password, saltRounds);
}

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
}


const User = mongoose.model('User', userSchema);

export default User;