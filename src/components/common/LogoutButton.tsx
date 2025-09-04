import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/api/userApi';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await userApi.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 서버 로그아웃이 실패해도 클라이언트에서는 로그아웃 처리
      // 사용자에게 알림을 주고 로그인 페이지로 이동
      alert('로그아웃 처리 중 오류가 발생했습니다. 다시 로그인해주세요.');
      logout();
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
    >
      <LogOut className="h-4 w-4 inline mr-1" />
      로그아웃
    </button>
  );
};

export default LogoutButton; 