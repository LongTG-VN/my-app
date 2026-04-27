"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Location } from "@/app/_type/type";
import {
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  CameraIcon,
  MagnifyingGlassIcon, // Thêm Icon Kính lúp
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { locationService } from "@/app/_service/locationService";

const LocationPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<Location[]>([]);

  // --- STATE TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // --- STATE CHO MODAL THÊM ---
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addData, setAddData] = useState({
    tenViTri: "",
    tinhThanh: "",
    quocGia: "",
  });

  // --- STATE CHO MODAL SỬA ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Location>>({});

  // --- UPLOAD IMAGE STATE & REF ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUploadId, setSelectedUploadId] = useState<number | null>(null);

  const { currentLocations, totalPages, indexOfFirstUser, indexOfLastUser } =
    useMemo(() => {
      const last = currentPage * usersPerPage;
      const first = last - usersPerPage;
      return {
        currentLocations: locations?.slice(first, last) || [],
        totalPages: Math.ceil((locations?.length || 0) / usersPerPage),
        indexOfFirstUser: first,
        indexOfLastUser: last,
      };
    }, [locations, currentPage, usersPerPage]);

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
              currentPage === i
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-gray-500 hover:bg-white border"
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

  // --- API CALLS ---
  const getLocationList = async () => {
    try {
      setLoading(true);
      const res: Location[] = await locationService.getLocation();
      setLocations(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vị trí này không?")) return;
    try {
      await locationService.deleteLocation(id);
      if (currentLocations.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      getLocationList();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa!");
    }
  };

  // --- LOGIC: THÊM VỊ TRÍ ---
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newData = { ...addData, hinhAnh: "" } as Location;
      await locationService.addLocation(newData);
      alert("Thêm thành công!");
      setIsAddOpen(false);
      setAddData({ tenViTri: "", tinhThanh: "", quocGia: "" });
      getLocationList();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi thêm!");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: SỬA VỊ TRÍ ---
  const openEditModal = (location: Location) => {
    setEditData(location);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await locationService.updateLocation(editData.id!, editData as Location);
      alert("Cập nhật thành công!");
      setIsEditOpen(false);
      getLocationList();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC TÌM KIẾM ---
  const handleSearch = async (name: string) => {
    try {
      setLoading(true);
      if (name.trim() === "") {
        getLocationList();
        return;
      }
      const res = await locationService.Pagination(name);
      setLocations(res);
      setCurrentPage(1); // Trở về trang 1 khi search
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi handleSearch khi searchTerm thay đổi (có delay để không gọi API liên tục)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // --- LOGIC: CLICK HÌNH ẢNH ĐỂ UPLOAD ---
  const handleImageClick = (id: number) => {
    setSelectedUploadId(id);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUploadId) return;

    try {
      setLoading(true);
      await locationService.uploadLocationImage(selectedUploadId, file);
      alert("Cập nhật ảnh thành công!");
      getLocationList();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tải ảnh lên!");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedUploadId(null);
    }
  };

  useEffect(() => {
    getLocationList();
  }, []);

  return (
    <div className=" min-h-screen space-y-6">
      
      {/* HEADER: Search Bar & Nút Thêm Mới */}
      <div className="flex flex-wrap justify-between items-center gap-4 px-2">
        <div className="flex flex-1 max-w-md items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-gray-700 py-1"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 font-bold text-sm flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" /> Thêm vị trí mới
        </button>
      </div>

      {/* Input File ẩn đi, chỉ dùng khi click vào hình ảnh */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Bảng Dữ Liệu */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[800px]">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr className="text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="w-24 py-5 px-6 text-center">ID</th>
                <th className="w-auto py-5 px-6 text-left">Khu vực / Vị trí</th>
                <th className="w-64 py-5 px-6 text-left">Tỉnh thành</th>
                <th className="w-32 py-5 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : currentLocations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <MapPinIcon className="w-10 h-10 text-gray-300" />
                      <span className="text-gray-500 font-medium">Không tìm thấy vị trí nào.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                    <td className="py-5 px-6 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 text-xs font-mono font-semibold text-gray-600">
                        #{location.id}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        
                        {/* Khu vực Hình ảnh - Click để upload */}
                        <div 
                          onClick={() => handleImageClick(location.id)}
                          className="relative w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm shrink-0 cursor-pointer group/img"
                          title="Click để thay đổi ảnh"
                        >
                          {location.hinhAnh && location.hinhAnh.startsWith("http") ? (
                            <Image src={location.hinhAnh} alt={location.tenViTri} width={48} height={48} className="w-full h-full object-cover group-hover/img:opacity-50 transition-opacity" unoptimized />
                          ) : (
                            <MapPinIcon className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover/img:opacity-50" />
                          )}
                          {/* Icon Camera hiện ra khi hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 bg-black/20 transition-all">
                            <CameraIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm mb-0.5 truncate">{location.tenViTri}</span>
                          <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <MapPinIcon className="w-3.5 h-3.5" />
                            {location.quocGia}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                        {location.tinhThanh}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => openEditModal(location)} 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
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
          {!loading && locations.length > 0 && (
            <div className="flex flex-wrap justify-between items-center p-6 border-t border-gray-50 bg-gray-50/30 gap-4">
              <p className="text-sm text-gray-500 font-medium order-2 md:order-1">
                Hiển thị <span className="text-gray-800">{indexOfFirstUser + 1}</span> - <span className="text-gray-800">{Math.min(indexOfLastUser, locations.length)}</span> trên <span className="text-gray-800">{locations.length}</span>
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

      {/* ================= MODAL THÊM ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">Thêm Vị Trí Mới</h2>
              <button onClick={() => setIsAddOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Tên Vị Trí</label>
                <input
                  type="text"
                  required
                  value={addData.tenViTri}
                  onChange={(e) => setAddData({ ...addData, tenViTri: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="VD: Quận 1..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Tỉnh Thành</label>
                  <input
                    type="text"
                    required
                    value={addData.tinhThanh}
                    onChange={(e) => setAddData({ ...addData, tinhThanh: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="VD: Hồ Chí Minh"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Quốc Gia</label>
                  <input
                    type="text"
                    required
                    value={addData.quocGia}
                    onChange={(e) => setAddData({ ...addData, quocGia: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="VD: Việt Nam"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 italic mt-2">* Hình ảnh có thể được cập nhật sau tại danh sách.</p>
              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-bold">Hủy bỏ</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 font-bold transition-all">Thêm Mới</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL SỬA ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">Cập Nhật Vị Trí</h2>
              <button onClick={() => setIsEditOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Tên Vị Trí</label>
                <input
                  type="text"
                  required
                  value={editData.tenViTri || ""}
                  onChange={(e) => setEditData({ ...editData, tenViTri: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Tỉnh Thành</label>
                  <input
                    type="text"
                    required
                    value={editData.tinhThanh || ""}
                    onChange={(e) => setEditData({ ...editData, tinhThanh: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Quốc Gia</label>
                  <input
                    type="text"
                    required
                    value={editData.quocGia || ""}
                    onChange={(e) => setEditData({ ...editData, quocGia: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-bold">Hủy bỏ</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 font-bold transition-all">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LocationPage;