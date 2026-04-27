"use server";

import { userService } from "@/app/_service/userService";
import { RegisterUser } from "../../_type/type";
import { redirect } from "next/navigation";

export async function handleRegisterAction(formData: FormData) {
  // Lấy dữ liệu từ formData
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const birthday = formData.get("birthday") as string;
  const genderRaw = formData.get("gender") as string; // Trả về "true" hoặc "false" (string)
  const role = formData.get("role") as "ADMIN" | "USER";
let isSuccess = false;
  // Chuẩn bị object theo đúng interface RegisterUser
  const userData: RegisterUser = {
    name,
    email,
    password,
    phone: phone || null,
    birthday: birthday || null,
    gender: genderRaw === "true", // Ép kiểu từ string sang boolean
    role: role || "USER",
  };

  try {
    const result = await userService.signUp(userData);
   if (result) {
      isSuccess = true;
    }
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return { error: "Đăng ký không thành công. Vui lòng thử lại." };
  }


  if (isSuccess) {
    redirect("/auth/login"); 
  }
}