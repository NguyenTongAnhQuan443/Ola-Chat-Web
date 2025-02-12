export default function Header() {
  return (
    <header className="bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between w-100 position-sticky top-0 w-100" style={{ padding: "16px 100px" }}>

      {/* Logo + Social */}
      <div className="d-flex align-items-center">
        <img
          src={require("../../assests/icons/Logomark.svg").default}
          alt="Logo"
          className="me-2"
        />
        <h1 className="fs-5 fw-bold mb-0">Social</h1>
      </div>

      {/* Thanh tìm kiếm ở giữa */}
      <div className="input-group" style={{ maxWidth: "582px" }}>
        <span className="input-group-text bg-white ps-3">
          <img
            src={require("../../assests/icons/Search.svg").default}
            alt="Search"
            width="18"
            height="18"
          />
        </span>
        <input
          type="text"
          className="form-control bg-white border-start-0"
          placeholder="Search"
        />
      </div>

      {/* Nút Logout bên phải */}
      <button className="btn btn-light d-flex align-items-center bg-white border-0">
        Logout
        <img
          src={require("../../assests/icons/User.svg").default}
          alt="Logout"
          width="20"
          height="20"
          className="ms-2 ms-3"
        />
      </button>
    </header>
  );
}
