export function AuthContainer({
  children,
  showBackButton = false,
  onBackClick
}: {
  children: React.ReactNode
  showBackButton?: boolean
  onBackClick?: () => void
}) {
  return (
    <div className='container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center py-5'>
      {showBackButton && (
        <button
          className='btn btn-link text-secondary  position-absolute top-0 start-0 ms-3 mt-4'
          onClick={onBackClick}
          style={{ textDecoration: 'none' }}
        >
          &lt; Back
        </button>
      )}
      <div className='position-fixed top-0 start-50 translate-middle-x mt-4'>
        <h1 className='h3 text-primary'>Social</h1>
      </div>
      <div className='row justify-content-center w-75' style={{ paddingTop: '60px' }}>
        <div className='col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4'>{children}</div>
      </div>
    </div>
  )
}
