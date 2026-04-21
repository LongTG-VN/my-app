import axiosClient from "./axiosClient";
import { User, Response, LoginData ,RegisterUser} from "../_type/type";
// BỎ CÁI NÀY: import { sign } from "crypto"; (Cái này của Node.js, không dùng ở đây)

export const userService = {
  signIn: async (email: string, password: string): Promise<User> => {
    // THÊM await ở đây để đợi dữ liệu về
    const res = await axiosClient.post<any, Response<LoginData>>("/auth/signin", {
      email,
      password,
    });
    return res.content.user; 
  },

  signUp: async (userData: any): Promise<User> => {
    try {      
      const res = await axiosClient.post<any, Response<User>>("/auth/signup", userData);
      return res.content; 
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      throw error; 
    }       
}
};