import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import candidateRoutes from './routes/candidateroute.js';
import jobRoutes from './routes/jobroute.js';
import applicationRoutes from './routes/applicationroute.js';
import registerLoginRoutes from './routes/registerloginroute.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/candidates',candidateRoutes);
app.use('/jobs', jobRoutes);
app.use('/jobs', applicationRoutes);
app.use('/',registerLoginRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
.then(() =>{
  app.listen(PORT,() =>{
  console.log(`Server started at http://localhost:${PORT}`);
});
})
.catch((error) =>{
  console.error('Database connection failed:',error);
  process.exit(1);
});

