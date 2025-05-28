import { createContext, useState } from 'react'
import { Conversation } from 'src/types/message.type'
// import { ExtendedPurchase } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>

 selectedConversation: Conversation | null
  setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>

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
   selectedConversation: null,
  setSelectedConversation: () => null,
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

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)


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
        selectedConversation,
    setSelectedConversation,
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
