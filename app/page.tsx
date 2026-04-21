"use client";
import Image from "next/image";
import { userService } from "./_service/userService";
import { Response, LoginData , User , RegisterUser } from "./_type/type";
import { AxiosResponse } from "axios";
import { log } from "console";

export default async function Home() {
  // 1. Gọi hàm signIn và đợi dữ liệu về
  // Vì đây là Server Component, console.log sẽ hiện ở Terminal của VS Code
  const handleRegister = async () => {
    // 1. Chuẩn bị dữ liệu ĐÚNG GU của Server CyberSoft
    const data: any = {
      name: "Thai Gia Long",
      email: `long_${Date.now()}@gmail.com`, // Email mới mỗi lần bấm
      password: "123",
      phone: "0912345678",
      birthday: "19/05/2000", 
      gender: true,
      role: "USER"
    };

    try {
      console.log("Đang gửi data:", data);
      const result = await userService.signUp(data);
      
      alert(`Đăng ký thành công cho: ${result.name}`);
      console.log("Dữ liệu User mới:", result);
    } catch (error: any) {
      // 2. Bắt lỗi 400 và soi xem Server "chửi" gì
      console.error("LỖI 400 RỒI ÔNG ƠI:");
      console.log("Nội dung lỗi:", error.response?.data);
      
      // Hiển thị thông báo lỗi chi tiết từ Server nếu có
      const message = error.response?.data?.content || "Dữ liệu không hợp lệ!";
      alert("Lỗi: " + message);
    }
  };



  // 2. In ra để kiểm tra cấu trúc
  
  return (
    
<div className="p-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-5">Đăng ký tài khoản</h1>
      <button 
        onClick={handleRegister}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Bấm để Đăng ký ngay
      </button>
      <p className="mt-4 text-gray-500 text-sm italic">
        *Mỗi lần bấm sẽ tạo một email ngẫu nhiên để tránh lỗi trùng dữ liệu.
      </p>
    </div>

  );
}