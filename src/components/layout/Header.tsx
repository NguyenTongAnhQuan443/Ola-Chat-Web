export function Header() {
    return (
      <header className="navbar navbar-light bg-white border-bottom px-4 py-2">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <div className="bg-primary rounded-circle p-2 me-2">
              <span className="text-white fw-bold">P</span>
            </div>
            <span className="fw-bold">Social</span>
          </a>
          <div className="d-flex align-items-center flex-grow-1 mx-4">
            <div className="position-relative flex-grow-1 max-w-md">
              <input type="search" className="form-control" placeholder="Search" aria-label="Search" />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <button className="btn btn-link text-dark text-decoration-none">Logout</button>
          </div>
        </div>
      </header>
    )
}