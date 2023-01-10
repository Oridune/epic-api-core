import mongoose from "mongoose";

export interface IFile {
  name?: string;
  url: string;
  sizeInBytes?: number;
  alt?: string;
}

export const FileSchema = new mongoose.Schema({
  name: String,
  url: String,
  sizeInBytes: Number,
  alt: String,
});
