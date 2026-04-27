import axiosClient from "./axiosClient";
import { Booking, Response } from "../_type/type";

export const bookingService = {
  getBooking: async (): Promise<Booking[]> => {
    try {
      const res: Response<Booking[]> = await axiosClient.get("/dat-phong");
      return res.content;
    } catch (error) {
      throw error;
    }
  },

  // SỬA: Thêm tham số data và truyền vào axiosClient.post
  addBooking: async (data: Booking): Promise<boolean> => {
    try {
      await axiosClient.post("/dat-phong", data);
      return true;
    } catch (error) {
      throw error;
    }
  },

  getDetailBooking: async (id: number): Promise<Booking> => {
    try {
      const res: Response<Booking> = await axiosClient.get(`/dat-phong/${id}`);
      return res.content;
    } catch (error) {
      throw error;
    }
  },

  updateBooking: async (id: number, data: Booking): Promise<boolean> => {
    try {
      await axiosClient.put(`/dat-phong/${id}`, data);
      return true;
    } catch (error) {
      throw error;
    }
  },

  deleteBooking: async (id: number): Promise<boolean> => {
    try {
      await axiosClient.delete(`/dat-phong/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // SỬA: Đổi .delete thành .get và trả về res.content thay vì true
  getDetailBookingByUser: async (MaNguoiDung: number): Promise<Booking[]> => {
    try {
      const res: Response<Booking[]> = await axiosClient.get(
        `/dat-phong/lay-theo-nguoi-dung/${MaNguoiDung}`
      );
      return res.content;
    } catch (error) {
      throw error;
    }
  },
};