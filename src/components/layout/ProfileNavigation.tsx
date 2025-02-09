import { NavLink } from "react-router-dom";

export default function ProfileNavigation() {
  return (
    <aside className="w-64 bg-white h-screen p-6 shadow">
      {/* Thông tin người dùng */}
      <div className="mb-6 text-center">
        <img
          src="https://via.placeholder.com/80"
          alt="Avatar"
          className="rounded-full mx-auto"
        />
        <h2 className="text-lg font-semibold mt-2">Robert Fox</h2>
        <p className="text-gray-500 text-sm">Software Engineer</p>
      </div>

      {/* Menu điều hướng */}
      <nav>
        <ul>
          <li><NavLink to="/" className="block py-2 hover:text-blue-600">🏠 Home</NavLink></li>
          <li><NavLink to="/profile" className="block py-2 hover:text-blue-600">👤 Profile</NavLink></li>
          <li><NavLink to="/messages" className="block py-2 hover:text-blue-600">💬 Messages</NavLink></li>
          <li><NavLink to="/notifications" className="block py-2 hover:text-blue-600">🔔 Notifications</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
}
