import { createContext, useState } from 'react'
// import { ExtendedPurchase } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  reset: () => void
  refreshConversations: () => void
  refreshListFriend: () => void
  refreshConversationsFlag: number
  refreshListFriendFlag: number
}

export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null,
  refreshConversations: () => {},
  refreshListFriend: () => {},
  refreshConversationsFlag: 0,
  refreshListFriendFlag: 0
})

const initialAppContext = getInitialAppContext()

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({
  children,
  defaultValue = initialAppContext
}: {
  children: React.ReactNode
  defaultValue?: AppContextInterface
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultValue.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(defaultValue.profile)

  const [refreshConversationsFlag, setRefreshConversationsFlag] = useState(0)
  const refreshConversations = () => setRefreshConversationsFlag((f) => f + 1)

  const [refreshListFriendFlag, setRefreshListFriendFlag] = useState(0)
  const refreshListFriend = () => setRefreshListFriendFlag((f) => f + 1)

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
        refreshConversations,
        refreshListFriend,
        refreshConversationsFlag,
        refreshListFriendFlag,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
