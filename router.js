import express from "express";
import multer from "multer";
import { CreateAccount } from "./authentication/AuthController.js";

const router = express.Router();
const upload = multer({ dest: "public/images" });

router.post("/signUp", CreateAccount);
export default router;
