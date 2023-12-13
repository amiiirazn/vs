import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config({ path: __dirname + "../.env" });
import otpgen from "otp-generator";
const hashstring = async (password: string): Promise<string> => {
  const salt = 10;
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};
const comparhashstring = async (
  plainpassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compareSync(plainpassword, hashedPassword);
};
const generatetoken = (data: string): string => {
  return jwt.sign(data, `${process.env.SECRET_KEY}`);
};
const comperatoken = (token: string) => {
  try {
    return jwt.verify(token, `${process.env.SECRET_KEY}`);
  } catch (error) {
    console.error("Token verification error:", error);
  }
};

const otp_gen = async () => {
  return otpgen.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
};
export { hashstring, comparhashstring, generatetoken, comperatoken, otp_gen };
