import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/ProfileNavigation'
import { useContext, useEffect, useState } from 'react'
import userApi from 'src/apis/user.api'
import { AppContext } from 'src/contexts/app.context'

export default function DashboardPage() {
  const { profile, setProfile } = useContext(AppContext)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile()
        setProfile(res.data.data)
      } catch (error) {
        console.error('Lỗi khi lấy profile:', error)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className='d-flex flex-column vh-100'>
      <Header />
      <div className='d-flex flex-grow-1 bac' style={{ backgroundColor: '#fafbff', padding: '48px 100px' }}>
        <Sidebar />
        <main className='flex-grow-1 mx-5 bg-transparent' style={{ overflow: 'auto', height: 'calc(100vh - 60px)' }}>
          <Outlet />
        </main>
        {/* <aside className="w-25 p-4 bg-white shadow-sm align-self-start position-sticky top-0">
          <h2 className="fw-bold fs-5 mb-3">Suggested Friends</h2>
          <ul className="list-unstyled">
            <li className="py-2">👩 Olivia Anderson - Financial Analyst</li>
            <li className="py-2">👨 Thomas Baker - Project Manager</li>
            <li className="py-2">👩 Lily Lee - Graphic Designer</li>
            <li className="py-2">👨 Andrew Harris - Data Scientist</li>
          </ul>
        </aside>  */}
      </div>
    </div>
  )
}
