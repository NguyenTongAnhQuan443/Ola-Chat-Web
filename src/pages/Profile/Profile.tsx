import { useContext, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import userApi from 'src/apis/user.api';
import { AppContext } from 'src/contexts/app.context'

export default function Profile() {
  const { profile, setProfile } = useContext(AppContext)

  return (
    <div className='container pb-5'>
      {/* User Card */}
      <div className='container'>
        <div className='card p-4 mb-4 shadow-sm rounded-4'>
          <div className='row'>
            {/* Avatar + Info - Left Column */}
            <div className='col-md-8 d-flex align-items-center'>
              <img
                src={
                  profile?.avatar
                    ? profile.avatar
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'
                }
                alt='avatar'
                className='rounded-circle me-4'
                width='100'
                height='100'
                style={{ objectFit: 'cover' }}
              />
              <div>
                <h4 className='mb-1 fw-bold'>{profile?.displayName || 'Robert Fox'}</h4>
                <div className='d-flex align-items-center gap-2 text-secondary mb-1'>
                  <span>@{profile?.username || 'robert'}</span>
                </div>
                <div className='text-secondary'>{profile?.role || 'Software Engineer'}</div>
              </div>
            </div>

            {/* Stats - Right Column */}
            <div className='col-md-4 d-flex align-items-center justify-content-end'>
              <div className='d-flex gap-4 text-center'>
                <div className='px-2'>
                  <div className='fw-bold fs-4'>12</div>
                  <div className='text-secondary'>Posts</div>
                </div>
                <div className='px-2'>
                  <div className='fw-bold fs-4'>207</div>
                  <div className='text-secondary'>Followers</div>
                </div>
                <div className='px-2'>
                  <div className='fw-bold fs-4'>64</div>
                  <div className='text-secondary'>Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Tabs - Simplified and cleaner */}
        <ul className='nav nav-tabs mb-4 border-0'>
          <li className='nav-item'>
            <NavLink
              to='my-posts'
              className={({ isActive }) => 
                `nav-link px-4 ${isActive ? 'fw-medium text-dark border-bottom border-2 border-dark' : 'text-secondary'}`
              }
            >
              My Posts
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='saved-posts'
              className={({ isActive }) => 
                `nav-link px-4 ${isActive ? 'fw-medium text-dark border-bottom border-2 border-dark' : 'text-secondary'}`
              }
            >
              Saved Posts
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='settings'
              className={({ isActive }) => 
                `nav-link px-4 ${isActive ? 'fw-medium text-dark border-bottom border-2 border-dark' : 'text-secondary'}`
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Nội dung động */}
      <Outlet />
    </div>
  )
}