import { NavLink } from 'react-router-dom'

export default function ProfileNavigation() {
  return (
    <aside
      className='bg-white shadow-sm rounded-5 align-self-start position-sticky top-0'
      style={{ width: '20rem', minHeight: 'auto' }}
    >
      {/* Ảnh bìa */}
      <div className='position-relative'>
        <img
          src='../../assests/icons/navigation/Cover.svg'
          alt='Cover'
          className='w-100 rounded-top'
          style={{ height: '100px', objectFit: 'cover' }}
        />
        <img
          src='../../assests/icons/navigation/Avatar.svg'
          alt='Avatar'
          className='rounded-circle border border-3 border-white position-absolute'
          style={{
            width: '64px',
            height: '64px',
            left: '26px',
            bottom: '-32px'
          }}
        />
      </div>

      {/* Phần chứa thông tin cá nhân & navigation */}
      <div className='p-4'>
        {/* Thông tin cá nhân */}
        <div className='text-start mt-4'>
          <h2 className='fs-6 fw-bold mb-1'>Robert Fox</h2>
          <p className='text-muted small mb-0'>Software Engineer</p>
        </div>

        {/* Navigation */}
        {/* Navigation */}
        <nav>
          <ul className='list-unstyled mt-3'>
            <li>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 border-bottom pb-3 mb-2 text-decoration-none text-dark fw-medium ${
                    isActive ? 'fw-bold' : ''
                  }`
                }
              >
                <img
                  src='../../assests/icons/navigation/Home.svg'
                  alt='Home'
                  width='20'
                  height='20'
                  className='me-2'
                />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/profile'
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 border-bottom pb-3 mb-2 text-decoration-none text-dark fw-medium ${
                    isActive ? 'fw-bold' : ''
                  }`
                }
              >
                <img
                  src='../../assests/icons/navigation/User.svg'
                  alt='Profile'
                  width='20'
                  height='20'
                  className='me-2'
                />
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/messages'
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 border-bottom pb-3 mb-2 text-decoration-none text-dark fw-medium ${
                    isActive ? 'fw-bold' : ''
                  }`
                }
              >
                <img
                  src='../../assests/icons/navigation/Send.svg'
                  alt='Messages'
                  width='20'
                  height='20'
                  className='me-2'
                />
                Messages
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/notifications'
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 text-decoration-none text-dark fw-medium ${isActive ? 'fw-bold' : ''}`
                }
              >
                <img
                  src='../../assests/icons/navigation/Notification.svg'
                  alt='Notifications'
                  width='20'
                  height='20'
                  className='me-2'
                />
                Notifications
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}
