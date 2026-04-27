import { handleLoginAction } from "./action";

export default function LoginPage() {
  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Server Side Login</h2>
      
      {/* Sử dụng thuộc tính action của form thay vì onSubmit */}
      <form action={handleLoginAction as any} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          style={{ padding: '10px' }} 
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          style={{ padding: '10px' }} 
          required 
        />
        <button 
          type="submit" 
          style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}