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
          <div className='row align-items-center'>
            {/* Avatar + Info */}
            <div className='col-md-8 d-flex align-items-center'>
              <img
                src={
                  profile?.avatar
                    ? profile.avatar
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'
                }
                alt='avatar'
                className='rounded-circle border border-2 me-4'
                width='80'
                height='80'
              />
              <div>
                <div className='d-flex align-items-center gap-2 mb-1'>
                  <h5 className='mb-0 fw-semibold'>{profile?.displayName}</h5>
                  <span className='text-muted'> / </span>
                  <span className='text-muted'>@{profile?.username}</span>
                </div>
                <div className='text-muted text-start'>{profile?.role}</div>
              </div>
            </div>

            {/* Stats */}
            <div className='col-md-4 d-flex justify-content-md-end justify-content-start mt-3 mt-md-0'>
              <div className='d-flex gap-3 text-center'>
                <div>
                  <div className='fw-semibold fs-5'>12</div>
                  <div className='text-muted'>Posts</div>
                </div>
                <div>
                  <div className='fw-semibold fs-5'>207</div>
                  <div className='text-muted'>Followers</div>
                </div>
                <div>
                  <div className='fw-semibold fs-5'>64</div>
                  <div className='text-muted'>Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Tabs */}
        <ul className='nav nav-tabs border-0 '>
          <li className='nav-item'>
            <NavLink
              to='my-posts'
              className={({ isActive }) => 'nav-link' + (isActive ? ' fw-normal text-dark' : ' text-muted')}
            >
              My Posts
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='saved-posts'
              className={({ isActive }) => 'nav-link' + (isActive ? ' fw-normal text-dark' : ' text-muted')}
            >
              Saved Posts
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='settings/general'
              className={({ isActive }) => 'nav-link' + (isActive ? ' fw-normal text-dark' : ' text-muted')}
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
