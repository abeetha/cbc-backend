import express from 'express';
import { createStudent, getStudents,deleteStudent } from '../controllers/studentController.js';

const studentRouter = express.Router();

studentRouter.get('/',getStudents)

studentRouter.post('/',createStudent)

studentRouter.delete('/',deleteStudent)

export default studentRouter;