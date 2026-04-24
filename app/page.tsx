import Image from "next/image";
import { userService } from "./_service/userService";
import { Response, LoginData , User , RegisterUser, Location } from "./_type/type";
import { log } from "console";
import { locationService } from "./_service/locationService";

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
const location: Location = {
  "id": 1000,
  "tenViTri": "CD",
  "tinhThanh": "VC",
  "quocGia": "A",
  "hinhAnh": "AC"
}

// tạo input từ file


try {
//  const a = await locationService.uploadImage(19384, "");
//  console.log(a);
 
} catch (error) {
  console.log(error);
  
}


  return (
    
<h1>Trang Chủ</h1>
  );
}