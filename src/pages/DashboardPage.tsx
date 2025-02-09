import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/ProfileNavigation";
import SuggestedFriends from "../components/layout/SuggestedFriends";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar bên trái (Luôn hiển thị) */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header trên cùng (Luôn hiển thị) */}
        <Header />

        {/* Nội dung thay đổi khi chuyển trang */}
        <main className="p-6 bg-gray-100 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
