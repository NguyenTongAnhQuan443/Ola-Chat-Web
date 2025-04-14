import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/ProfileNavigation'
import { useEffect, useState } from 'react'
import { User } from 'src/types/user.type'

export default function DashboardPage() {
  const [profile, setProfile] = useState<User | null>(null)
    async function getMyInfo() {
      const accessToken = localStorage.getItem('accessToken')
  
      if (!accessToken) {
        throw new Error('Access token not found in localStorage')
      }
  
      try {
        const response = await fetch('http://localhost:8080/ola-chat/users/my-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
  
        const data = await response.json()
        return data.data
      } catch (error) {
        console.error('Error fetching user info:', error)
        throw error
      }
    }
  
    useEffect(() => {
      // Gọi hàm getMyInfo khi component được mount
      getMyInfo()
        .then((data) => {
          setProfile(data)
        })
        .catch((error) => {
          console.error('Lỗi khi lấy thông tin người dùng:', error)
        })
    }, [])
  
    if (!profile) {
      return <div>Đang tải thông tin người dùng...</div>
    }
  

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
