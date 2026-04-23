"use client";
import { userService } from "@/app/_service/userService";
import { RegisterUser, User } from "@/app/_type/type";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const UserPage = () => {
  // danh sách sinh viên in ra
  const [userList, setUserList] = useState<User[]>([]);
  // Form add
  const [formAdding, setFormAdding] = useState<boolean>(false);
  // From Edit
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Trạng Thái
  const [loading, setLoading] = useState<boolean>(true);
  // Phân Trang
  // Trang Hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  // Số phần tử trên mỗi trang
  const [usersPerPage] = useState(10);
  // Dùng useMemo để tính toán lại mỗi khi userList hoặc trang thay đổi

  // Dùng useMemo để tính toán phân trang mỗi khi userList hoặc trang thay đổi
  const { currentUsers, totalPages, indexOfFirstUser, indexOfLastUser } =
    useMemo(() => {
      // Tính toán phân trang trực tiếp trên userList
      // Lấy index của phần tử cuối cùng trên trang hiện tại
      // ví dụ : currentPage = 2, usersPerPage = 10 => last = 20
      const last = currentPage * usersPerPage;
      // Tính index của phần tử đầu tiên trên trang hiện tại
      // ví dụ : currentPage = 2, usersPerPage = 10 => first = 10
      const first = last - usersPerPage;
      return {
        // Lấy phần tử từ userList để hiển thị trên trang hiện tại
        currentUsers: userList?.slice(first, last), // Danh sách hiển thị trên trang hiện tại
        // Tính tổng số trang dựa trên độ dài của userList
        totalPages: Math.ceil(userList.length / usersPerPage),
        // Tính toán index của phần tử đầu tiên và cuối cùng trên trang hiện tại (dùng để hiển thị thông tin "Hiển thị 1-10 trên 100")
        indexOfFirstUser: first,
        indexOfLastUser: last,
      };
    }, [userList, currentPage, usersPerPage]);

  // Lấy tất cả user
  const getUserList = async () => {
    setLoading(true);
    try {
      const res = await userService.Pagination(0,"");
      setUserList(res);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm theo tên
  const handleSearch = async (name: string) => {
    setLoading(true);
    try {
      const users: User[] = await userService.Pagination(1, name);
      console.log(users);

      setUserList(users);
    } catch (error) {
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  // Xóa User
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await userService.deleteUser(id);
      // Nếu xóa user cuối cùng của trang, tự động lùi về 1 trang
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      getUserList();
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  // Layout in ra
  const renderPaginationItems = () => {
    const pages = []; // Mảng chứa các nút trang sẽ hiển thị
    const range = 2; // Số lượng trang hiển thị xung quanh trang hiện tại
    // Duyệt qua tất cả các trang từ 1 đến totalPages
    for (let i = 1; i <= totalPages; i++) {
      // Luôn hiển thị trang đầu, trang cuối, và các trang trong khoảng range của currentPage
      if (
        // Luôn hiển thị trang đầu tiên và trang cuối cùng
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
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
          </button>,
        );
      }
      // Thêm dấu ba chấm nếu có khoảng cách
      else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
        pages.push(
          <span
            key={i}
            className="flex items-center justify-center w-8 text-gray-400 font-bold"
          >
            ...
          </span>,
        );
      }
    }
    return pages;
  };

  // Edit user
  const handleEditUser = async (userId: any, updatedUser: any) => {
    try {
      setLoading(true);
      await userService.updateUser(userId, updatedUser as RegisterUser);
      setEditingUser(null);
      getUserList();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    } finally {
      setLoading(false);
    }
  };

  // add user
  const handleAddUSer = async (data: any) => {
    const newUser: RegisterUser = {
      name: data.name as string,
      email: data.email as string,
      password: data.password as string, // Thêm mới
      role: data.role as "ADMIN" | "USER",
      phone: (data.phone as string) || null,
      birthday: (data.birthday as string) || null, // Thêm mới
      gender: data.gender === "true", // Chuyển từ string "true"/"false" sang boolean
    };

    try {
      setLoading(true);
      await userService.addUser(newUser);
      setFormAdding(false);
      getUserList();
    } catch (error) {
      console.error("Lỗi thêm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 px-2">
        <div className="flex flex-1 max-w-md items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Khai báo FormData để lấy dữ liệu từ các thẻ input có thuộc tính "name"
              const formData = new FormData(e.currentTarget);
              const searchValue = formData.get("searchKeyword") as string;
              handleSearch(searchValue);
              setCurrentPage(1);
            }}
            className="w-full"
          >
            <input
              name="searchKeyword" // BẮT BUỘC PHẢI CÓ NAME ĐỂ FORM LẤY ĐƯỢC VALUE
              type="text"
              placeholder="Tìm theo tên rồi ấn Enter"
              className="w-full outline-none bg-transparent text-sm text-gray-700"
            />
          </form>
        </div>

        <button
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 font-bold text-sm"
          onClick={() => setFormAdding(true)}
        >
          + Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[800px]">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                <th className="w-20 p-6 text-center">ID</th>
                <th className="w-64 p-6 text-left">Người dùng</th>
                <th className="p-6 text-left">Liên hệ</th>
                <th className="w-32 p-6 text-center">Vai trò</th>
                <th className="w-40 p-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-6 text-center text-xs font-mono text-gray-400">
                      #{user.id}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Bọc Avatar trong một cái nhãn (label) để tận dụng cơ chế kích hoạt input */}
                        <label className="relative w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100 cursor-pointer group">
                          {user.avatar && user.avatar.startsWith("http") ? (
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={40} // Thêm width/height bắt buộc cho thẻ Image
                              height={40}
                              className="w-full h-full object-cover"
                              unoptimized // Thử thêm thuộc tính này nếu ảnh vẫn không hiện
                            />
                          ) : (
                            <UserCircleIcon className="w-full h-full text-gray-300" />
                          )}
                        </label>

                        <span className="font-bold text-gray-800 truncate">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-medium text-gray-600">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-400 italic">
                        {user.phone || "Chưa cập nhật"}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${user.role === "ADMIN" ? "bg-indigo-50 text-indigo-600" : "bg-zinc-100 text-zinc-600"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setEditingUser(user)} // Truyền object user hiện tại vào state
                          className="text-blue-500 hover:text-blue-700 transition"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => user.id && handleDelete(user.id)}
                          className="text-red-400 hover:text-red-600 transition"
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

          {/* Pagination UI */}
          {!loading && userList.length > 0 && (
            <div className="flex flex-wrap justify-between items-center p-6 border-t border-gray-50 bg-gray-50/30 gap-4">
              {/* Hiển thị số lượng bản ghi để user dễ theo dõi */}
              <p className="text-sm text-gray-500 font-medium order-2 md:order-1">
                Hiển thị{" "}
                <span className="text-gray-800">{indexOfFirstUser + 1}</span> -{" "}
                <span className="text-gray-800">
                  {Math.min(indexOfLastUser, userList.length)}
                </span>{" "}
                trên <span className="text-gray-800">{userList.length}</span>
              </p>

              <div className="flex items-center gap-1 order-1 md:order-2 mx-auto md:mx-0">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-30 hover:bg-white transition shadow-sm bg-white"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </button>

                {/* Gọi hàm render logic ở đây */}
                <div className="flex items-center gap-1">
                  {renderPaginationItems()}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border disabled:opacity-30 hover:bg-white transition shadow-sm bg-white"
                >
                  <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay và Form thêm người dùng */}
      {formAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Lớp nền mờ - click vào đây để đóng */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setFormAdding(false)}
          ></div>

          {/* Nội dung Form */}
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800">
                Tạo tài khoản mới
              </h3>
              <button
                onClick={() => setFormAdding(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                handleAddUSer(data);
              }}
            >
              {/* --- Hàng 1: Tên --- */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                  Họ và tên
                </label>
                <input
                  name="name"
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              {/* --- Hàng 2: Email & Mật khẩu --- */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Email
                  </label>
                  <input
                    name="email"
                    required
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="name@mail.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Mật khẩu
                  </label>
                  <input
                    name="password"
                    required
                    type="password"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* --- Hàng 3: Ngày sinh & Giới tính --- */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Ngày sinh
                  </label>
                  <input
                    name="birthday"
                    type="date"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none font-bold text-gray-700"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
              </div>

              {/* --- Hàng 4: Điện thoại & Vai trò --- */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Điện thoại
                  </label>
                  <input
                    name="phone"
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    placeholder="09..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Vai trò
                  </label>
                  <select
                    name="role"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none font-bold text-gray-700"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              {/* --- Buttons --- */}
              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormAdding(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Lưu dữ liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setEditingUser(null)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-extrabold text-gray-800 mb-6">
              Chỉnh sửa nhân viên
            </h3>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingUser || editingUser.id == null) return;
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());

                
                console.log(data);
                
                
                const userId = editingUser.id;

                handleEditUser(userId, data);
              }}
            >
              {/* Họ tên */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                  Họ và tên
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editingUser.name} // Đổ dữ liệu cũ vào đây
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>

              {/* Email & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Email
                  </label>
                  <input
                    name="email"
                    required
                    defaultValue={editingUser.email}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Vai trò
                  </label>
                  <select
                    name="role"
                    defaultValue={editingUser.role}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none font-bold"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              {/* Giới tính & Ngày sinh */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    defaultValue={String(editingUser.gender)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    Ngày sinh
                  </label>
                  <input
                    name="birthday"
                    type="date"
                    defaultValue={editingUser.birthday?.split("T")[0]}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none"
                  />
                </div>
              </div>

              {/* Điện thoại */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  defaultValue={editingUser.phone || ""}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none"
                />
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
