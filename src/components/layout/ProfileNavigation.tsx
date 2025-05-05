import { profile } from 'console'
import { NavLink } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import { setProfileToLS } from './../../utils/auth'
import { useContext } from 'react'
import path from 'src/constants/path'
import DashboardPage from './../../pages/DashboardPage';

export default function ProfileNavigation() {
  const { setProfile, profile } = useContext(AppContext)
  return (
    <aside
      className='bg-white shadow-sm rounded-5 align-self-start position-sticky top-0'
      style={{ width: '20rem', minHeight: 'auto', minWidth: '320px' }}
    >
      {/* Ảnh bìa */}
      <div className='position-relative'>
        <img
          src='https://thunao.com/wp-content/uploads/2023/01/Anh-bia-Zalo-ve-bau-troi-1024x576.jpeg'
          alt='Cover'
          className='w-100 rounded-top'
          style={{ height: '100px', objectFit: 'cover' }}
        />
        <img
          src={
            profile?.avatar
              ? profile.avatar
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'
          }
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
          <h2 className='fs-6 fw-bold mb-1'>{profile?.displayName}</h2>
          <p className='text-muted small mb-0'>{profile?.role}</p>
        </div>

        {/* Navigation */}
        {/* Navigation */}
        <nav>
          <ul className='list-unstyled mt-3'>
            <li>
              <NavLink
                to={path.dashboard}
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 border-bottom pb-3 mb-2 text-decoration-none text-dark fw-medium ${
                    isActive ? 'fw-bold' : ''
                  }`
                }
              >
                <img
                  src='https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTExL3YxMTgxLXR1LWVsZW1lbnQtMjUwLXAtbTN3cXR3dTEucG5n.png'
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
                to={path.profile}
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 border-bottom pb-3 mb-2 text-decoration-none text-dark fw-medium ${
                    isActive ? 'fw-bold' : ''
                  }`
                }
              >
                <img
                  src='https://cdn-icons-png.flaticon.com/512/6522/6522516.png'
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
                to={path.messages}
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 border-bottom pb-3 mb-2 text-decoration-none text-dark fw-medium ${
                    isActive ? 'fw-bold' : ''
                  }`
                }
              >
                <img
                  src='https://icons.veryicon.com/png/o/miscellaneous/basic-icon/message-54.png'
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
                to={path.friends}
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 border-bottom pb-3 mb-2 text-decoration-none text-dark fw-medium ${
                    isActive ? 'fw-bold' : ''
                  }`
                }
              >
                <img
                  src='https://icons.veryicon.com/png/o/miscellaneous/basic-icon/message-54.png'
                  alt='Messages'
                  width='20'
                  height='20'
                  className='me-2'
                />
                Friends
              </NavLink>
            </li>
            <li>
              <NavLink
                to={path.notifications}
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 text-decoration-none text-dark fw-medium ${isActive ? 'fw-bold' : ''}`
                }
              >
                <img
                  src='https://cdn-icons-png.flaticon.com/512/3119/3119338.png'
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
