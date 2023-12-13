import userModel from "../model/userModel";
import { comperatoken } from "../modules/utils";
import cookieParser from "cookie-parser";
interface User {
  username: string;
}
const checklogin = async (req: any, res: any, next: any) => {
  try {
    const { username } = req.body;
    const token = req.cookies.token;
    if (!token) throw { message: " log in to your account" };
    const Username = comperatoken(token);
    const user = await userModel.findOne({ username });
    if (token !== user?.token)
      throw { message: "Please log in to your account" };
    req.username = user?.username;
    next();
  } catch (error) {
    // error.message = "Please log in to your account";
    res.clearCookie("token");
    next({ error, status: 400 });
  }
};
export { checklogin };
