import { createContext, useState, ReactNode, useContext } from 'react'

interface FriendRequestContextType {
  shouldRefreshRequests: boolean
  triggerRefreshRequests: () => void
}

const initialValue: FriendRequestContextType = {
  shouldRefreshRequests: false,
  triggerRefreshRequests: () => {}
}

const FriendRequestContext = createContext<FriendRequestContextType>(initialValue)

export const useFriendRequest = () => useContext(FriendRequestContext)

export const FriendRequestProvider = ({ children }: { children: ReactNode }) => {
  const [shouldRefreshRequests, setShouldRefreshRequests] = useState(false)

  const triggerRefreshRequests = () => {
    setShouldRefreshRequests(prev => !prev) // Toggle để đảm bảo luôn trigger được
  }

  return (
    <FriendRequestContext.Provider value={{ shouldRefreshRequests, triggerRefreshRequests }}>
      {children}
    </FriendRequestContext.Provider>
  )
}