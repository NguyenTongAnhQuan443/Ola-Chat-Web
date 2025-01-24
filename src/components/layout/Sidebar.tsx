export function Sidebar() {
    return (
      <div className="bg-white border-end" style={{ width: "280px" }}>
        <div className="p-4">
          <div className="d-flex align-items-center mb-4">
            <img
              src="/placeholder.svg?height=48&width=48"
              alt="Profile"
              className="rounded-circle me-3"
              width={48}
              height={48}
            />
            <div>
              <h6 className="mb-0">Robert Fox</h6>
              <small className="text-muted">Software Engineer</small>
            </div>
          </div>
          <nav className="nav flex-column gap-2">
            <a href="#" className="nav-link d-flex align-items-center text-dark">
              <i className="fas fa-home me-3" style={{ width: "20px" }}></i>
              Home
            </a>
            <a href="#" className="nav-link d-flex align-items-center text-dark">
              <i className="fas fa-user me-3" style={{ width: "20px" }}></i>
              Profile
            </a>
            <a href="#" className="nav-link d-flex align-items-center text-dark active">
              <i className="fas fa-comments me-3" style={{ width: "20px" }}></i>
              Messages
            </a>
            <a href="#" className="nav-link d-flex align-items-center text-dark">
              <i className="fas fa-bell me-3" style={{ width: "20px" }}></i>
              Notifications
            </a>
          </nav>
        </div>
      </div>
    )
  }
  