import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/ProfileNavigation'
import { useContext, useEffect, useState } from 'react'
import userApi from 'src/apis/user.api'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'

export default function DashboardPage() {
  const { profile, setProfile } = useContext(AppContext)

  useEffect(() => {
    const getProgile = async () => {
      try {
        const res = await userApi.getProfile()
        setProfile(res.data.data)
      } catch (error) {
        toast.error('Server error')
      }
    }

    getProgile()
  }, [])

  return (
    <div className='d-flex flex-column vh-100'>
      <Header />
      <div className='d-flex flex-grow-1 bac' style={{ backgroundColor: '#fafbff', padding: '48px 48px' }}>
      <Sidebar />
      <main className='flex-grow-1 ms-5 me-0 bg-transparent' style={{ height: 'calc(100vh - 60px)', marginRight: '48px' }}>
        <Outlet />
      </main>
      </div>
    </div>
  )
}
