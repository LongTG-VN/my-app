"use client";
import { userService } from '@/app/_service/userService';
import { User } from '@/app/_type/type';
import React, { useState, useEffect, useMemo } from 'react';
import {
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const UserPage = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Dùng useMemo để tính toán lại mỗi khi userList hoặc trang thay đổi
  const { currentUsers, totalPages, indexOfFirstUser, indexOfLastUser } = useMemo(() => {
    const last = currentPage * usersPerPage;
    const first = last - usersPerPage;
    return {
      currentUsers: userList.slice(first, last),
      totalPages: Math.ceil(userList.length / usersPerPage),
      indexOfFirstUser: first,
      indexOfLastUser: last
    };
  }, [userList, currentPage, usersPerPage]);

  const getUserList = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUser();
      setUserList(res);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

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


  const renderPaginationItems = () => {
    const pages = [];
    const range = 2; // Số lượng trang hiển thị xung quanh trang hiện tại

    for (let i = 1; i <= totalPages; i++) {
      // Luôn hiển thị trang đầu, trang cuối, và các trang trong khoảng range của currentPage
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-10 h-10 rounded-lg text-sm font-bold transition ${currentPage === i
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-gray-500 hover:bg-white border'
              }`}
          >
            {i}
          </button>
        );
      }
      // Thêm dấu ba chấm nếu có khoảng cách
      else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
        pages.push(
          <span key={i} className="flex items-center justify-center w-8 text-gray-400 font-bold">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 px-2">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
          + Thêm người dùng
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
                <tr><td colSpan={5} className="p-10 text-center text-gray-500">Đang tải...</td></tr>
              ) : currentUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-500">Không có dữ liệu.</td></tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6 text-center text-xs font-mono text-gray-400">#{user.id}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserCircleIcon className="w-full h-full text-gray-300" />}
                        </div>
                        <span className="font-bold text-gray-800 truncate">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-medium text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-400 italic">{user.phone || 'Chưa cập nhật'}</div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-100 text-zinc-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button className="text-blue-500 hover:text-blue-700 transition">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => user.id && handleDelete(user.id)} className="text-red-400 hover:text-red-600 transition">
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
                Hiển thị <span className="text-gray-800">{indexOfFirstUser + 1}</span> - <span className="text-gray-800">{Math.min(indexOfLastUser, userList.length)}</span> trên <span className="text-gray-800">{userList.length}</span>
              </p>

              <div className="flex items-center gap-1 order-1 md:order-2 mx-auto md:mx-0">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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
    </div>
  );
};

export default UserPage;