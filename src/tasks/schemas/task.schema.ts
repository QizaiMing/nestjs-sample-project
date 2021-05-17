import { Schema } from 'mongoose';

export const TasksSchema = new Schema({
  title: String,
  description: String,
  done: Boolean,
});
