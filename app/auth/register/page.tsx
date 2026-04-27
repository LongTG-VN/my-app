import { handleRegisterAction } from "./action";

export default function RegisterPage() {
  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Đăng Ký Tài Khoản</h2>
      
      <form action={handleRegisterAction as any} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input name="name" placeholder="Họ và tên" style={inputStyle} required />
        
        <input name="email" type="email" placeholder="Email" style={inputStyle} required />
        
        <input name="password" type="password" placeholder="Mật khẩu" style={inputStyle} required />
        
        <input name="phone" placeholder="Số điện thoại" style={inputStyle} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Ngày sinh:</label>
          <input name="birthday" type="date" style={inputStyle} />
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label>Giới tính:</label>
          <label><input type="radio" name="gender" value="true" defaultChecked /> Nam</label>
          <label><input type="radio" name="gender" value="false" /> Nữ</label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Vai trò:</label>
          <select name="role" style={inputStyle}>
            <option value="USER">Người dùng (USER)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: '12px', 
            background: '#28a745', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Đăng Ký Ngay
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};