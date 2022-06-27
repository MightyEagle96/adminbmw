import CategorySchema from "../models/category";
import { ErrorHandler } from "./ErrorController";

export const CreateCategory = async (req, res) => {
  try {
    await CategorySchema.create(req.body);

    res.status(201).json({ title: "success", message: "new category added" });
  } catch (error) {
    ErrorHandler(error, res);
  }
};

export const UpdateCategory = async (req, res) => {
  try {
    await CategorySchema.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });

    res.status(200).json({ title: "success", message: "category updated" });
  } catch (error) {
    ErrorHandler(error, res);
  }
};

export const DeleteCategory = async (req, res) => {
  try {
    await CategorySchema.findByIdAndDelete(req.params.id);

    res.status(204).json({ title: "success", message: "category deleted" });
  } catch (error) {
    ErrorHandler(error, res);
  }
};

export const ViewCategories = async (req, res) => {
  try {
    const categories = await CategorySchema.find(req.query);
    res.json({ categories });
  } catch (error) {
    ErrorHandler(error, res);
  }
};

export const ViewCategory = async (req, res) => {
  try {
    const category = await CategorySchema.findById(req.params.id);
    res.json({ category });
  } catch (error) {
    ErrorHandler(error, res);
  }
};
