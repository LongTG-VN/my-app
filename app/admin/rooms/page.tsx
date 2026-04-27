"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Room } from "@/app/_type/type";
import { roomService } from "@/app/_service/roomService"; // Đảm bảo đường dẫn đúng
import {
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

const RoomPage = () => {
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- FORM STATES ---
  const [formAdding, setFormAdding] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // --- UPLOAD IMAGE STATES ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUploadId, setSelectedUploadId] = useState<number | null>(null);

  // --- PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(10);

  const { currentRooms, totalPages, indexOfFirstRoom, indexOfLastRoom } =
    useMemo(() => {
      const last = currentPage * roomsPerPage;
      const first = last - roomsPerPage;
      return {
        currentRooms: roomList?.slice(first, last) || [],
        totalPages: Math.ceil((roomList?.length || 0) / roomsPerPage),
        indexOfFirstRoom: first,
        indexOfLastRoom: last,
      };
    }, [roomList, currentPage, roomsPerPage]);

  // --- API CALLS ---
  const getRoomList = async () => {
    setLoading(true);
    try {
      const res = await roomService.Pagination("");
      setRoomList(res);
    } catch (error) {
      console.error("Lỗi lấy danh sách phòng:", error);
      setRoomList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (name: string) => {
    setLoading(true);
    try {
      const rooms: Room[] = await roomService.Pagination(name);
      setRoomList(rooms);
      setCurrentPage(1);
    } catch (error) {
      setRoomList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;
    try {
      await roomService.deleteRoom(id);
      if (currentRooms.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      getRoomList();
    } catch (error) {
      console.error("Lỗi xóa phòng:", error);
    }
  };

  // --- XỬ LÝ DỮ LIỆU FORM (Ép kiểu Number và Boolean) ---
  const parseFormData = (formData: FormData, currentImage: string = ""): any => {
    return {
      tenPhong: formData.get("tenPhong") as string,
      moTa: formData.get("moTa") as string,
      khach: Number(formData.get("khach")),
      phongNgu: Number(formData.get("phongNgu")),
      giuong: Number(formData.get("giuong")),
      phongTam: Number(formData.get("phongTam")),
      giaTien: Number(formData.get("giaTien")),
      maViTri: Number(formData.get("maViTri")),
      // Checkbox trả về "on" nếu được check, ngược lại là null
      mayGiat: formData.get("mayGiat") === "on",
      banLa: formData.get("banLa") === "on",
      tivi: formData.get("tivi") === "on",
      dieuHoa: formData.get("dieuHoa") === "on",
      wifi: formData.get("wifi") === "on",
      bep: formData.get("bep") === "on",
      doXe: formData.get("doXe") === "on",
      hoBoi: formData.get("hoBoi") === "on",
      banUi: formData.get("banUi") === "on",
      hinhAnh: currentImage, // Giữ nguyên ảnh cũ, sẽ đổi ảnh qua tính năng upload riêng
    };
  };

  const handleAddRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRoom = parseFormData(formData);

    try {
      setLoading(true);
      await roomService.addRoom(newRoom as Room);
      setFormAdding(false);
      getRoomList();
    } catch (error) {
      console.error("Lỗi thêm phòng:", error);
      alert("Lỗi khi thêm phòng!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRoom) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedRoom = parseFormData(formData, editingRoom.hinhAnh);
    updatedRoom.id = editingRoom.id; // Phải giữ lại ID

    try {
      setLoading(true);
      await roomService.updateRoom(editingRoom.id, updatedRoom as Room);
      setEditingRoom(null);
      getRoomList();
    } catch (error) {
      console.error("Lỗi cập nhật phòng:", error);
      alert("Lỗi khi cập nhật phòng!");
    } finally {
      setLoading(false);
    }
  };

  // --- UPLOAD IMAGE ---
  const handleImageClick = (id: number) => {
    setSelectedUploadId(id);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUploadId) return;

    try {
      setLoading(true);
      await roomService.uploadImg(selectedUploadId, file);
      alert("Cập nhật ảnh phòng thành công!");
      getRoomList();
    } catch (error) {
      alert("Lỗi khi tải ảnh lên!");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedUploadId(null);
    }
  };

  useEffect(() => {
    getRoomList();
  }, []);

  const renderPaginationItems = () => {
    const pages = [];
    const range = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-10 h-10 rounded-lg text-sm font-bold transition ${
              currentPage === i ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-gray-500 hover:bg-white border"
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
        pages.push(<span key={i} className="flex items-center justify-center w-8 text-gray-400 font-bold">...</span>);
      }
    }
    return pages;
  };

  // UI DÙNG CHUNG CHO FORM ADD & EDIT ĐỂ TRÁNH LẶP CODE DÀI
  const RoomFormFields = ({ defaultValues }: { defaultValues?: Partial<Room> }) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Tên phòng</label>
          <input name="tenPhong" required defaultValue={defaultValues?.tenPhong} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Giá tiền ($)</label>
          <input name="giaTien" type="number" required defaultValue={defaultValues?.giaTien} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Mã Vị Trí</label>
          <input name="maViTri" type="number" required defaultValue={defaultValues?.maViTri} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Khách</label>
          <input name="khach" type="number" required defaultValue={defaultValues?.khach} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-center" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">P.Ngủ</label>
          <input name="phongNgu" type="number" required defaultValue={defaultValues?.phongNgu} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-center" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Giường</label>
          <input name="giuong" type="number" required defaultValue={defaultValues?.giuong} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-center" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">P.Tắm</label>
          <input name="phongTam" type="number" required defaultValue={defaultValues?.phongTam} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-center" />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Tiện ích phòng</label>
        <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
          {[
            { key: "mayGiat", label: "Máy giặt" }, { key: "banLa", label: "Bàn là" }, { key: "tivi", label: "Tivi" },
            { key: "dieuHoa", label: "Điều hòa" }, { key: "wifi", label: "Wifi" }, { key: "bep", label: "Bếp" },
            { key: "doXe", label: "Đỗ xe" }, { key: "hoBoi", label: "Hồ bơi" }, { key: "banUi", label: "Bàn ủi" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input type="checkbox" name={item.key} defaultChecked={defaultValues?.[item.key as keyof Room] as boolean} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Mô tả</label>
        <textarea name="moTa" rows={3} defaultValue={defaultValues?.moTa} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20"></textarea>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      
      {/* Input File Ẩn cho Upload Ảnh */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {/* HEADER TÌM KIẾM & THÊM */}
      <div className="flex flex-wrap justify-between items-center gap-4 px-2">
        <div className="flex flex-1 max-w-md items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSearch(formData.get("searchKeyword") as string);
            }}
            className="w-full"
          >
            <input name="searchKeyword" type="text" placeholder="Tìm theo tên phòng..." className="w-full outline-none bg-transparent text-sm text-gray-700" />
          </form>
        </div>

        <button onClick={() => setFormAdding(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 font-bold text-sm">
          + Thêm phòng mới
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[1000px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                <th className="w-20 p-6 text-center">ID</th>
                <th className="w-72 p-6 text-left">Thông tin phòng</th>
                <th className="p-6 text-left">Sức chứa</th>
                <th className="w-32 p-6 text-center">Giá tiền</th>
                <th className="w-32 p-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-500">Đang tải...</td></tr>
              ) : currentRooms.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-500">Không có dữ liệu phòng.</td></tr>
              ) : (
                currentRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6 text-center text-xs font-mono text-gray-400">#{room.id}</td>
                    
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        {/* ẢNH PHÒNG - Click để upload */}
                        <div 
                          onClick={() => handleImageClick(room.id)}
                          className="relative w-16 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 cursor-pointer group/img shrink-0"
                          title="Click để đổi ảnh phòng"
                        >
                          {room.hinhAnh && room.hinhAnh.startsWith("http") ? (
                            <Image src={room.hinhAnh} alt={room.tenPhong} fill className="object-cover group-hover/img:opacity-50 transition-all" unoptimized />
                          ) : (
                            <HomeModernIcon className="w-6 h-6 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 bg-black/20 transition-all">
                            <CameraIcon className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 line-clamp-1" title={room.tenPhong}>{room.tenPhong}</span>
                          <span className="text-[11px] font-medium text-gray-400">Vị trí: #{room.maViTri}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                        <span className="bg-gray-100 px-2 py-1 rounded-md">{room.khach} Khách</span>
                        <span className="bg-gray-100 px-2 py-1 rounded-md">{room.phongNgu} P.Ngủ</span>
                        <span className="bg-gray-100 px-2 py-1 rounded-md">{room.giuong} Giường</span>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <span className="font-black text-emerald-600">${room.giaTien}</span>
                    </td>

                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setEditingRoom(room)} className="text-blue-500 hover:text-blue-700 transition">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(room.id)} className="text-red-400 hover:text-red-600 transition">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination UI */}
          {!loading && roomList.length > 0 && (
            <div className="flex flex-wrap justify-between items-center p-6 border-t border-gray-50 bg-gray-50/30 gap-4">
              <p className="text-sm text-gray-500 font-medium order-2 md:order-1">
                Hiển thị <span className="text-gray-800">{indexOfFirstRoom + 1}</span> - <span className="text-gray-800">{Math.min(indexOfLastRoom, roomList.length)}</span> trên <span className="text-gray-800">{roomList.length}</span>
              </p>
              <div className="flex items-center gap-1 order-1 md:order-2 mx-auto md:mx-0">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-30 hover:bg-white transition shadow-sm bg-white">
                  <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-1">{renderPaginationItems()}</div>
                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-30 hover:bg-white transition shadow-sm bg-white">
                  <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL ADD --- */}
      {formAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setFormAdding(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh] border border-gray-100">
            <h3 className="text-xl font-extrabold text-gray-800 mb-6">Thêm Phòng Mới</h3>
            <form onSubmit={handleAddRoom}>
              <RoomFormFields />
              <div className="pt-6 flex gap-3 mt-4">
                <button type="button" onClick={() => setFormAdding(false)} className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Lưu dữ liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT --- */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setEditingRoom(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh] border border-gray-100">
            <h3 className="text-xl font-extrabold text-gray-800 mb-6">Chỉnh Sửa Phòng</h3>
            <form onSubmit={handleEditRoom}>
              <RoomFormFields defaultValues={editingRoom} />
              <div className="pt-6 flex gap-3 mt-4">
                <button type="button" onClick={() => setEditingRoom(null)} className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoomPage;