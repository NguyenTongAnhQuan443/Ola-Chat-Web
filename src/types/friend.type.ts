//To render information
export interface Friend {
  userId: string
  displayName: string
  avatar: string | null
}

//To send request add friend
export interface FriendRequest {
  senderId: string
  receiverId: string
  message: string
}

//Loi moi da nhan
export interface FriendReceived {
  requestId: string
  userId: string
  displayName: string
  avatar: string | 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'
}

//Loi moi da gui