export function AuthContainer({ children }: { children: React.ReactNode }) {
    return (
      <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
        <div className="row justify-content-center w-75">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
            <div className="text-center mb-4">
              <h1 className="h3 text-primary">Social</h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    )
  }