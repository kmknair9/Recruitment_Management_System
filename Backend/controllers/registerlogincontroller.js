import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TIME = '2h';

export const loginUser = async (req,res) => {
  const { email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required'});
    }
  try { 
    const user = await User.findOne( {email} );
      if (!user) {
        return res.status(401).json({ message: 'Invalid Credentials!!!'});
      }
    const valid = await user.validatePassword(password);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid Credentials!!!!'});
      }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {expiresIn: JWT_TIME});
    res.json({ token, userId: user._id, role: user.role});
  } catch (err) {
      console.error('Login Server Error', err);
      res.status(500).json({ message: 'Server Error during login'});
  }
};

export const registerUser = async (req,res) => {
  const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, Password and Role are Required!!!'});
    }
  try {
    const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json( { message: 'User Already exists with this Email'});
      } 
    const newUser = new User({ email, role });
    await newUser.setPassword(password);
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id, role: newUser.role}, JWT_SECRET, { expiresIn: JWT_TIME});
    res.status(201).json({ role: newUser.role, userId: newUser._id, token , message: role === 'Candidate' ? 'Registered Successfully. Please complete your candidate details.': 'User Registered Successfully.' });
  } catch (err) {
      console.error('Registration Server Error!!!!', err);
      res.status(500).json({ message: 'Server Error for Registration' });
  }
};
