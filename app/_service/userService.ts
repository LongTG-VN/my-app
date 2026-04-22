import axiosClient from "./axiosClient";
import { User, Response, LoginData, RegisterUser } from "../_type/type";

export const userService = {
  signIn: async (email: string, password: string): Promise<User> => {
    // THÊM await ở đây để đợi dữ liệu về
    const res = await axiosClient.post<any, Response<LoginData>>("/auth/signin", {
      email,
      password,
    });
    return res.content.user;
  },

  signUp: async (userData: RegisterUser): Promise<User> => {
    try {
      const res = await axiosClient.post<RegisterUser, Response<User>>("/auth/signup", userData);
      return res.content;
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      throw error;
    }
  },
  getAllUser: async (): Promise<User[]> => {
    const res = await axiosClient.get<any, Response<User[]>>("/users");
    return res.content;
  },
  addUser: async (userData: RegisterUser): Promise<boolean> => {
    try {
      const res = await axiosClient.post<RegisterUser, Response<User>>("/users", userData);
      return true;
    } catch (error) {
      console.error("Lỗi thêm người dùng:", error);
      throw error;
    }
  },
  deleteUser: async (id: number): Promise<boolean> => {
    try {
      await axiosClient.delete(`/users/${id}`);
      return true;
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error);
      throw error;
    }
  },
  updateUser: async (id: number, userData: RegisterUser): Promise<boolean> => {
    try {
      const res = await axiosClient.put<RegisterUser, Response<User>>(`/users/${id}`, userData);
      return true;
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      throw error;
    }
  },
  searchUser: async (keyword: string): Promise<User[]> => {
    try {
      const res = await axiosClient.get<any, Response<User[]>>(`/users/search?keyword=${encodeURIComponent(keyword)}`);
      return res.content;
    } catch (error) {
      console.error("Lỗi tìm kiếm người dùng:", error);
      throw error;
    }
  },
  uploadAvatar: async (id: number, file: File): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("formFile", file);

      const res = await axiosClient.post<FormData, Response<any>>(`/users/${id}/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return true;
    } catch (error) {
      console.error("Lỗi tải lên avatar:", error);
      throw error;
    }
  }
};