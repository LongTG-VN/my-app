// app/(auth)/login/actions.ts
"use server";

import { userService } from '@/app/_service/userService';
import { cookies } from 'next/headers';

export async function handleLoginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

 console.log(formData)

  try {
    const data = await userService.signIn(email, password);

    if (data?.token) {
      // Với Server Side, ta dùng Cookies thay vì LocalStorage
      // vì Server không truy cập được LocalStorage của trình duyệt
      const cookieStore = await cookies();
      cookieStore.set('USER_TOKEN', data.token, { httpOnly: true, secure: true });
      
      return { success: true, message: "Đăng nhập thành công" };
    }
  } catch (error) {
    return { success: false, message: "Sai tài khoản hoặc mật khẩu" };
  }
  
  return { success: false, message: "Đã có lỗi xảy ra" };
}