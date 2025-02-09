export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🔵 Social</h1>
      <input
        type="text"
        placeholder="🔍 Search"
        className="border px-4 py-2 rounded w-1/3"
      />
      <button className="text-gray-600">Logout 🚪</button>
    </header>
  );
}
