import axiosClient from "./axiosClient";
import { Location, Response } from "../_type/type";

export const locationService = {
  getLocation: async (): Promise<Location[]> => {
    try {
      const res = await axiosClient.get<any, Response<Location[]>>("/vi-tri");
      return res.content;
    } catch (error) {
      throw error;
    }
  },

  addLocation: async (data: Location): Promise<boolean> => {
    try {
      const res = await axiosClient.post<any, Response<Location>>(
        "/vi-tri",
        data,
      );
      console.log("Thêm thành công:", res.content);
      return true;
    } catch (error: any) {
      // Bắt lỗi cụ thể, ví dụ nếu là 403 thì in ra cảnh báo thiếu quyền
      if (error.response?.status === 403) {
        console.error(
          "Lỗi 403: Bạn không có quyền (hoặc thiếu Token) để thêm vị trí!",
        );
      } else {
        console.error("Lỗi khi thêm vị trí:", error);
      }
      // Trả về false thay vì làm sập ứng dụng
      return false;
    }
  },
  Pagination: async (name: String): Promise<Location[]> => {
    try {
      const obj = {
        pageIndex: 1,
        pageSize: 100,
        keyword: name,
      };
      const res = await axiosClient.get<any, Response<any>>(
        "/vi-tri/phan-trang-tim-kiem",
        { params: obj },
      );
      return res.content.data;
    } catch (error) {
      throw error;
    }
  },
  detailLocation: async (id: number): Promise<Location> => {
    try {
      const res = await axiosClient.get<any, Response<Location>>(
        `/vi-tri/${id}`,
      );
      return res.content;
    } catch (error) {
      throw error;
    }
  },

  updateLocation: async (id: number, data: Location): Promise<Location> => {
    try {
      const res = await axiosClient.put<any, Response<Location>>(
        `/vi-tri/${id}`,
        data,
      );
      return res.content;
    } catch (error) {
      throw error;
    }
  },

  deleteLocation: async (id: number): Promise<Boolean> => {
    try {
      const res = await axiosClient.delete<any , Response<boolean>>(`/vi-tri/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  uploadImage:async (id: number , file: File): Promise<any> => {
    try {
      const formdata = new FormData();
      formdata.append(`formFile`, file);
      const res = await axiosClient.post<any, Response<any>>(`//vi-tri/upload-hinh-vitri`, formdata);
      console.log("Thành công");
      return res.content
    } catch (error) {
      throw error
    }

  }
};
