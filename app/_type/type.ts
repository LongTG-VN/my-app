export interface User {
  id: number;
  name: string;
  email: string;
  password: string; 
  phone: string | null;
  birthday: string;
  avatar: string | null;
  gender: boolean; // true: Nam, false: Nữ (tùy API quy định)
  role: "ADMIN" | "USER"; 
}

export interface Room {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean; // Bàn là
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean; // Chỗ đỗ xe
  hoBoi: boolean;
  banUi: boolean; // Bàn ủi (thường API này trả về cả banLa và banUi)
  maViTri: number;
  hinhAnh: string;
}

export interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export interface Comment {
  id: number;
  maPhong: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string; // Kiểu ISO Date string
  noiDung: string;
  saoBinhLuan: number;
}
export interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string; // Định dạng ISO: "YYYY-MM-DD"
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface Response<T> {
  statusCode: number;
  content: T ;
  dateTime: string;
}