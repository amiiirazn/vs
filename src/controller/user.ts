import userModel from "../model/userModel";
import { Request, Response, NextFunction } from "express";
import { singupSchima } from "../validation/singupschima";
import { phoneNumberValidator } from "@persian-tools/persian-tools";

interface requser extends Request {
  username?: string;
  new_password?: string;
  confirm_password?: string;
  old_password?: string;
}
interface user{
  value:string
}
import { hashstring, generatetoken, comparhashstring, otp_gen } from "../modules/utils";
const singup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    interface user {
      password: string;
    }
    const {
      first_name,
      last_name,
      username,
      password,
      confirm_password,
      email,
      phone_number,
      national_code,
    } = req.body;
    await singupSchima.validate(req.body, { abortEarly: false });
    let user = null;
    user = await userModel.findOne({ username });
    if (user) throw { message: "The username is duplicated" };
    user = await userModel.findOne({ phone_number });
    if (user) throw { message: "The phone number is duplicated" };
    user = await userModel.findOne({ email });
    if (user) throw { message: "The mail is duplicated" };
    user = await userModel.findOne({ national_code });
    if (user) throw { message: "The national number is duplicated" };
    const hash = await hashstring(password);
    const result = await userModel.create({
      first_name,
      last_name,
      username,
      password: hash,
      email,
      phone_number,
      national_code,
    });
    // result.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: "ss",
      result,
    });
  } catch (error) {
    next({ error, status: 400 });
  }
};
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { profile, password } = req.body;
  try {
    const user = await userModel.findOne({
      $or: [{ username: profile }, { email: profile }],
    });
    if (!user)
      throw {
        message: "username or password is not correct",
      };
    const campera = await comparhashstring(password, user.password);
    if (!user || !campera)
      throw { message: "Username or password is not correct" };
    const token = generatetoken(user.username);
    user.token = token;
    user.save();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    res.status(200).json({
      status: 200,
      succes: true,
      message: "You have successfully logged into your account",
    });
  } catch (error) {
    next({ error, status: 400 });
  }
};
const logout = async (req: Request, res: any, next: NextFunction) => {
  try {
    const { username } = req.body;
    await userModel.updateOne({ username }, { $set: { token: "" } });

    res.clearCookie("token");
    res.status(200).json({
      message: "You have successfully logged out of your account",
      status: 200,
      success: true,
    });
  } catch (error) {
    next({ error, status: 400 });
  }
};

const dell = async (req: requser, res: Response, next: NextFunction) => {
  try {
    const { username } = req;
    await userModel.deleteOne({ username });
    res.status(200).json({
      message: "Your account has been successfully deleted",
      status: 200,
      success: true,
    });
  } catch (error) {
    next({ error, status: 400 });
  }
};
const get_profile = async (req: requser, res: Response, next: NextFunction) => {
  try {
    const { username } = req;
    const result = await userModel.findOne(
      { username },
      { updatedAt: 0, createdAT: 0, password: 0, __v: 0, _id: 0, token: 0 }
    );
    res.status(200).json(result);
  } catch (error) {
    next({ error, status: 400 });
  }
};
const change_password = async (
  req: requser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req;
    const { new_password, confirm_password, old_password } = req.body;
    if (new_password != confirm_password)
      throw { message: "The password is not the same" };
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        new_password
      )
    )
      throw {
        message:
          "The password must have more than 8 characters and at least one number, one letter and one special character",
      };

    const user = await userModel.findOne({ username });
    if (user == null) throw { message: "notFound user" };
    if (!comparhashstring(old_password, user.password))
      throw { message: "The old password is not correct" };
    console.log(old_password);
    if (!comparhashstring(new_password, user.password))
      throw {
        message:
          "The new password must not be the same as the previous password",
      };
    await userModel.updateOne(
      { username },
      { $set: [hashstring(new_password)] }
    );
    const result = hashstring(new_password);
    user.save();
    res.status(200).json({
      status: 200,
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next({ error, status: 400 });
  }
};
const otp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone_number } = req.body;
    const obj={value:String}
    const otp = otp_gen
    if (!phoneNumberValidator(phone_number))
      throw { message: "The mobile number entered is not correct" };
    const user = await userModel.findOne({ phone_number });
    if (!user) throw { message: "No user found with this phone number" };
//  user.otp= {value:OTP , }
  } catch (error) {}
};

export { singup, login, logout, dell, get_profile, change_password };
