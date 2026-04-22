import Image from "next/image";
import { userService } from "./_service/userService";
import { Response, LoginData , User , RegisterUser } from "./_type/type";
import { log } from "console";

export default async function Home() {
  // 1. Gọi hàm signIn và đợi dữ liệu về
  // Vì đây là Server Component, console.log sẽ hiện ở Terminal của VS Code
 
const user: RegisterUser = {
  name: "Nguyen Van A",
  email: "112asdasddas3@gmail.com",
  password: "123456",
  phone: "0123456789",
  birthday: "1990-01-01", 
  gender: true,
  role: "USER",
};

// try {
//   const newUser = await userService.deleteUser(54649);
//   console.log("Xóa người dùng thành công:", newUser);
// } catch (error) {
//   console.error("Lỗi xóa người dùng:", error);
// }


  // 2. In ra để kiểm tra cấu trúc
  
  return (
    
<h1>Trang Chủ</h1>
  );
}