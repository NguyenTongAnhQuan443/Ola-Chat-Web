import React, { useContext, useEffect, useState } from 'react'
import userApi from 'src/apis/user.api'
import { AppContext } from 'src/contexts/app.context'
import { LoginHistoryItem } from 'src/types/history.type'
import { profile } from 'console'

export default function HistoryLogin() {
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const { profile } = useContext(AppContext)

  useEffect(() => {
    const fetchLoginHistory = async () => {
      if(!profile) return
      try {
        const res = await userApi.getHistoryLogin(profile.userId)
        setLoginHistory(res.data.data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Đã xảy ra lỗi không xác định')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLoginHistory()
  }, [])

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString('vi-VN')
  }

  if (loading) return <div>Đang tải dữ liệu...</div>
  if (error) return <div className='text-danger'>{error}</div>

  return (
    <div className='container mt-4'>
      <h3 className='mb-4'>Lịch sử đăng nhập</h3>
      {loginHistory.length === 0 ? (
        <p>Không có lịch sử đăng nhập nào.</p>
      ) : (
        <ul className='list-group'>
          {loginHistory.map((item, index) => (
            <li key={index} className='list-group-item text-start'>
              <p>
                <strong>Thiết bị:</strong> {item.userAgent}
              </p>
              <p>
                <strong>Thời gian đăng nhập:</strong> {formatDateTime(item.loginTime)}
              </p>
              <p>
                <strong>Thời gian đăng xuất:</strong> {formatDateTime(item.logoutTime)}
              </p>
              <p>
                <strong>Trạng thái:</strong> {item.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
