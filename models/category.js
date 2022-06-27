import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: { type: String, unique: [true, "Category already exists"] },
});

const CategorySchema = model("Category", categorySchema);

export default CategorySchema;
