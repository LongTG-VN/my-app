import axiosClient from "./axiosClient";
import { Response, Room } from "../_type/type";

export const roomService = {
  getRoom: async (): Promise<Room[]> => {
    try {
      const res: Response<Room[]> = await axiosClient.get("/phong-thue");
      return res.content;
    } catch (error) {
      throw error;
    }
  },

  addRoom: async (data: Room): Promise<boolean> => {
    try {
      await axiosClient.post("/phong-thue", data); 
      return true;
    } catch (error) {
      throw error;
    }
  },

  getRoomWithLocation: async (id: number): Promise<Room[]> => {
    try {
      const res: Response<Room[]> = await axiosClient.get(
        "/phong-thue/lay-phong-theo-vi-tri",
        {
          params: {
            maViTri: id, 
          },
        }
      );
      return res.content;
    } catch (error) {
      throw error;
    }
  },

  getDetailRoom: async (id: number): Promise<Room> => {
    try {
      const res: Response<Room> = await axiosClient.get(`/phong-thue/${id}`);
      return res.content;
    } catch (error) {
      throw error;
    }
  },

  updateRoom: async (id: number, data: Room): Promise<boolean> => {
    try {
      await axiosClient.put(`/phong-thue/${id}`, data);
      return true;
    } catch (error) {
      throw error;
    }
  },

  deleteRoom: async (id: number): Promise<boolean> => {
    try {
      await axiosClient.delete(`/phong-thue/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  uploadImg: async (id: number, file: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append("formFile", file);
      
      const res : Response<Room[]>= await axiosClient.post(`/phong-thue/upload-hinh-phong`, formData, {
        params: {
          maPhong: id,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.content; 
    } catch (error) {
      console.error("Lỗi upload ảnh phòng:", error);
      throw error; 
    }
  },

  Pagination: async (name: string): Promise<Room[]> => {
    try {
      const obj = {
        pageIndex: 1,
        pageSize: 1000000, 
        keyword: name,
      };

      const res: Response<any> = await axiosClient.get("/phong-thue/phan-trang-tim-kiem", {
        params: obj,
      });
      
      return res.content.data;
    } catch (error) {
      throw error;
    }
  },
};