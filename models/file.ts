import mongoose from "mongoose";

export interface IFile extends mongoose.Types.Subdocument {
  name?: string;
  url: string;
  sizeInBytes?: number;
  alt?: string;
}

export const FileSchema = new mongoose.Schema<IFile>(
  {
    name: String,
    url: String,
    sizeInBytes: Number,
    alt: String,
  },
  { _id: false, versionKey: false }
);
