"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Booking } from "@/app/_type/type"; // Đảm bảo bạn đã khai báo type này
import { bookingService } from "@/app/_service/bookingService";
import {
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  UserIcon,
  HomeIcon
} from "@heroicons/react/24/outline";

const BookingPage = () => {
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- FORM STATES ---
  const [formAdding, setFormAdding] = useState<boolean>(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // --- STATE TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // --- CLIENT-SIDE FILTER & PAGINATION ---
  const { currentItems, totalPages, indexOfFirstItem, indexOfLastItem } = useMemo(() => {
    // 1. Lọc dữ liệu theo Search (Tìm theo Mã Phòng hoặc Mã Người Dùng)
    const filtered = bookingList.filter((b) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        b.maPhong.toString().includes(searchLower) ||
        b.maNguoiDung.toString().includes(searchLower)
      );
    });

    // 2. Cắt dữ liệu cho trang hiện tại
    const last = currentPage * itemsPerPage;
    const first = last - itemsPerPage;
    
    return {
      currentItems: filtered.slice(first, last),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      indexOfFirstItem: first,
      indexOfLastItem: Math.min(last, filtered.length),
    };
  }, [bookingList, currentPage, itemsPerPage, searchTerm]);

  // --- API CALLS ---
  const getBookingList = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getBooking();
      setBookingList(res);
    } catch (error) {
      console.error("Lỗi lấy danh sách đặt phòng:", error);
      setBookingList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy/xóa đơn đặt phòng này?")) return;
    try {
      await bookingService.deleteBooking(id);
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      getBookingList();
    } catch (error) {
      console.error("Lỗi xóa đơn đặt phòng:", error);
      alert("Xóa thất bại!");
    }
  };

  // --- XỬ LÝ DỮ LIỆU FORM ---
  const parseFormData = (formData: FormData): any => {
    return {
      maPhong: Number(formData.get("maPhong")),
      maNguoiDung: Number(formData.get("maNguoiDung")),
      ngayDen: formData.get("ngayDen") as string,
      ngayDi: formData.get("ngayDi") as string,
      soLuongKhach: Number(formData.get("soLuongKhach")),
    };
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newBooking = parseFormData(new FormData(e.currentTarget));

    try {
      setLoading(true);
      await bookingService.addBooking(newBooking as Booking);
      setFormAdding(false);
      getBookingList();
      alert("Tạo đơn đặt phòng thành công!");
    } catch (error) {
      console.error("Lỗi thêm đơn:", error);
      alert("Lỗi khi tạo đơn đặt phòng!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBooking || !editingBooking.id) return;
    
    const updatedBooking = parseFormData(new FormData(e.currentTarget));
    updatedBooking.id = editingBooking.id; 

    try {
      setLoading(true);
      await bookingService.updateBooking(editingBooking.id, updatedBooking as Booking);
      setEditingBooking(null);
      getBookingList();
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật đơn:", error);
      alert("Lỗi khi cập nhật đơn đặt phòng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingList();
  }, []);

  // Reset trang về 1 khi gõ tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Format Date hiển thị cho đẹp
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

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

  // --- UI FORM DÙNG CHUNG ---
  const BookingFormFields = ({ defaultValues }: { defaultValues?: Partial<Booking> }) => {
    // Đảm bảo định dạng YYYY-MM-DD cho input type="date"
    const formatDateForInput = (dateStr?: string) => {
      if (!dateStr) return "";
      try { return new Date(dateStr).toISOString().split('T')[0]; } 
      catch { return ""; }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Mã Phòng</label>
            <input name="maPhong" type="number" required defaultValue={defaultValues?.maPhong} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Mã Người Dùng</label>
            <input name="maNguoiDung" type="number" required defaultValue={defaultValues?.maNguoiDung} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Ngày Đến</label>
            <input name="ngayDen" type="date" required defaultValue={formatDateForInput(defaultValues?.ngayDen)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-700" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Ngày Đi</label>
            <input name="ngayDi" type="date" required defaultValue={formatDateForInput(defaultValues?.ngayDi)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-700" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Số Lượng Khách</label>
          <input name="soLuongKhach" type="number" required defaultValue={defaultValues?.soLuongKhach} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      
      {/* HEADER TÌM KIẾM & THÊM */}
      <div className="flex flex-wrap justify-between items-center gap-4 px-2">
        <div className="flex flex-1 max-w-md items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm theo Mã phòng hoặc Mã User..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-gray-700 py-1" 
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <button onClick={() => setFormAdding(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 font-bold text-sm flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Đặt phòng mới
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[900px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                <th className="w-20 p-6 text-center">ID Đơn</th>
                <th className="w-64 p-6 text-left">Thông tin liên kết</th>
                <th className="w-72 p-6 text-left">Thời gian lưu trú</th>
                <th className="w-32 p-6 text-center">Số khách</th>
                <th className="w-32 p-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : currentItems.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-500">Không có dữ liệu đặt phòng.</td></tr>
              ) : (
                currentItems.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6 text-center text-xs font-mono text-gray-400">#{booking.id}</td>
                    
                    <td className="p-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                          <HomeIcon className="w-4 h-4 text-blue-500" />
                          Phòng: #{booking.maPhong}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <UserIcon className="w-4 h-4 text-emerald-500" />
                          User: #{booking.maNguoiDung}
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-100">
                          <CalendarDaysIcon className="w-4 h-4" />
                          {formatDate(booking.ngayDen)}
                        </div>
                        <span className="text-gray-300 font-bold">➔</span>
                        <div className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-rose-100">
                          <CalendarDaysIcon className="w-4 h-4" />
                          {formatDate(booking.ngayDi)}
                        </div>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-bold">
                        {booking.soLuongKhach} người
                      </span>
                    </td>

                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setEditingBooking(booking)} className="text-blue-500 hover:text-blue-700 transition p-2 hover:bg-blue-50 rounded-xl">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => booking.id && handleDelete(booking.id)} className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-xl">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          {!loading && bookingList.length > 0 && (
            <div className="flex flex-wrap justify-between items-center p-6 border-t border-gray-50 bg-gray-50/30 gap-4">
              <p className="text-sm text-gray-500 font-medium order-2 md:order-1">
                Hiển thị <span className="text-gray-800">{indexOfFirstItem + 1}</span> - <span className="text-gray-800">{indexOfLastItem}</span> trên <span className="text-gray-800">{bookingList.length}</span>
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
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setFormAdding(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800">Tạo Đơn Đặt Phòng</h3>
              <button onClick={() => setFormAdding(false)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <BookingFormFields />
              <div className="pt-6 flex gap-3 mt-2">
                <button type="button" onClick={() => setFormAdding(false)} className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Lưu dữ liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT --- */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setEditingBooking(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800">Cập Nhật Đặt Phòng</h3>
              <button onClick={() => setEditingBooking(null)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <BookingFormFields defaultValues={editingBooking} />
              <div className="pt-6 flex gap-3 mt-2">
                <button type="button" onClick={() => setEditingBooking(null)} className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingPage;