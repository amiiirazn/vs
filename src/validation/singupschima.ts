import { object, string, ref } from "yup";
interface values {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  confirm_password: string;
  email: string;
  phone_number: string;
  national_code: string;
}
const singupSchima = object({
  first_name: string(),
  last_name: string().required(),
  username: string().min(8).required(),

  password: string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required(),
  confirm_password: string().oneOf(
    [ref("password")],
    "Passwords does not match"
  ),
  email: string()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  phone_number: string()
    .matches(/^(09)[\d]{9}$/)
    .required(),
  national_code: string()
    .matches(/^[0-9]{10}$/)
    .required(),
});
export { singupSchima };
