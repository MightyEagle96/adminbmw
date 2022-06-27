/* eslint-disable no-undef */
import Account from "../models/account.js";
import { createAccessToken, sendAccessToken } from "./token.js";
import bcrypt from "bcrypt";

import { isAuth } from "./isAuth.js";
import { ErrorHandler } from "../controllers/ErrorController.js";

export const CreateAccount = async (req, res) => {
  try {
    //create account
    const account = await Account.create(req.body);

    const accessToken = createAccessToken({ id: account._id });

    sendAccessToken(account, req, res, accessToken);
  } catch (error) {
    ErrorHandler(error, res, "auth");
  }
};

export const Login = async (req, res) => {
  try {
    //check if the email exists
    const account = await Account.findOne({ email: req.body.email });

    if (!account)
      return res.status(401).json({
        message: "Email address not found",
        title: "Error logging in",
        errorType: "login",
      });

    //check if the password is correct
    if (!(await bcrypt.compare(req.body.password, account.password)))
      return res.status(401).json({
        message: "Passwords do not match",
        title: "Error logging in",
        errorType: "login",
      });
    //if account is not verified send a message
    else {
      const accessToken = createAccessToken({ id: account._id });

      sendAccessToken(account, req, res, accessToken);
    }
  } catch (error) {
    ErrorHandler(error, res);
  }
};

export const IsLoggedIn = async (req, res, next) => {
  try {
    if (req.headers.authenticatedby === "jwt") {
      const userId = isAuth(req, res);
      if (userId) {
        const account = await Account.findById(userId);
        req.account = account;
      }
      next();
    } else if (req.headers.authenticatedby === "google") {
      const email = await googleAuth(req, res);
      const account = await Account.findOne({ email });
      req.account = account;
      next();
    } else if (req.headers.authorization) {
      const userId = isAuth(req, res);
      if (userId) {
        const account = await Account.findById(userId);
        req.account = account;
      }
      next();
    } else {
      return res.status(401).json({ message: "You are not logged in" });
    }
  } catch (error) {
    return res.status(401).json({ message: "session expired" });
  }
};

export const RestrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.account.role)) {
        return res.status(403).json({
          title: "Invalid Permission",
          message: "You do not have permission to perform this action",
        });
      }
      next();
    } catch (error) {
      //ErrorHandler(error, res);
      res
        .status(401)
        .json({ title: "Unauthorized", message: "You are not logged in" });
    }
  };
};
