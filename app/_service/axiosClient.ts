import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://airbnbnew.cybersoft.edu.vn/api',
  headers: {
    'Content-Type': 'application/json',
    // Token dự án của trung tâm (Token này luôn phải có)
    'tokenCybersoft': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5MSIsIkhldEhhblN0cmluZyI6IjAyLzA5LzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc4ODMwNzIwMDAwMCIsIm5iZiI6MTc1OTk0MjgwMCwiZXhwIjoxNzg4NDU0ODAwfQ.3f2gLYDZla_lDH4GWmfgSe9Il_QHrpoHIWhW6FSKTi8`,
  'token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTIyIiwiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwibmJmIjoxNzc2OTA1OTYwLCJleHAiOjE3Nzc1MTA3NjB9.HapHawJQL4I1mWgtFd1PZemgPOdOT7vC6AB9N6j5pjo"
  },
});

// Interceptor cho Request: Tự động đính kèm Token của User nếu đã đăng nhập
axiosClient.interceptors.request.use(
  (config) => {
    // Kiểm tra window để chắc chắn đang chạy ở Client (tránh lỗi Next.js Server Side)
    if (typeof window !== 'undefined') {
      // SỬA TẠI ĐÂY: Lấy đúng Key mà bạn đã lưu lúc Login thành công
      const token = localStorage.getItem('USER_TOKEN');
      
      if (token) {
        // Gắn token vào header. 
        // Lưu ý: API Cybersoft thường yêu cầu key là 'token' (viết thường)
    // console.log(token, "Token");
    
        config.headers.token = token; 
      } else {
        // console.log("ko có token");
        
      }
    }
    console.log("🚀 Lệnh chuẩn bị gửi đi có Headers là:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Giúp bạn lấy thẳng dữ liệu mà không cần thông qua .data
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về response.data để ở ngoài component bạn nhận được { content, statusCode... }
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tập trung
    if (error.response?.status === 401) {
      console.error("Phiên đăng nhập hết hạn!");
      // Có thể thêm logic xóa localStorage và đẩy về trang chủ nếu cần
      // localStorage.clear();
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;