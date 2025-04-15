import React, { useEffect, useState } from 'react';

export default function HistoryLogin() {
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLoginHistory = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
      console.log('AccessToken:', accessToken);
      console.log('UserID:', userInfo.userId); 
      if (!accessToken || !userInfo.userId) {
        setError('Không tìm thấy access token hoặc user ID');
        setLoading(false);
        return;
      }
  
      try {
        const apiUrl = `http://localhost:8080/ola-chat/api/login-history/${userInfo.userId}`; 
  
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu lịch sử đăng nhập');
        }
  
        const data = await response.json();
        setLoginHistory(data.data); 
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Đã xảy ra lỗi không xác định');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchLoginHistory();
  }, []);
  

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString('vi-VN');
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container mt-4">
  <h3 className="mb-4">Lịch sử đăng nhập</h3>
  {loginHistory.length === 0 ? (
    <p>Không có lịch sử đăng nhập nào.</p>
  ) : (
    <ul className="list-group">
      {loginHistory.map((item, index) => (
        <li key={index} className="list-group-item text-start">
          <p><strong>Thiết bị:</strong> {item.userAgent}</p>
          <p><strong>Thời gian đăng nhập:</strong> {formatDateTime(item.loginTime)}</p>
          <p><strong>Thời gian đăng xuất:</strong> {formatDateTime(item.logoutTime)}</p>
          <p><strong>Trạng thái:</strong> {item.status}</p>
        </li>
      ))}
    </ul>
  )}
</div>

  );
}
