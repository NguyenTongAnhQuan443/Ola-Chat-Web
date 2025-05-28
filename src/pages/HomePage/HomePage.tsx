import { useContext, useState } from 'react'
import './HomePage.css'
import { profile } from 'console';
import { AppContext } from 'src/contexts/app.context';

interface User {
  id: string
  name: string
  avatar: string
  title: string
}

interface Comment {
  id: string
  user: User
  content: string
  createdAt: string
}

interface Post {
  id: string
  user: User
  content: string
  createdAt: string
  likes: number
  comments: Comment[]
}

export default function HomePage() {
  const {profile} = useContext(AppContext)
  const [newComment, setNewComment] = useState<string>('')
  const [showComments, setShowComments] = useState<boolean>(false)
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        id: 'user1',
        name: profile?.displayName || 'Robert Fox',
        avatar: profile?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s',
        title: 'Digital Marketer'
      },
      content: "In today's fast-paced, digitally driven world, digital marketing is not just a strategy, it's a necessity for businesses of all sizes. ✍️",
      createdAt: '7 hours ago',
      likes: 15,
      comments: [
        {
          id: 'comment1',
          user: {
            id: 'user2',
            name: 'Bảo Thông',
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s',
            title: 'Project Manager'
          },
          content: 'Absolutely agree! Digital presence is everything in today\'s market.',
          createdAt: '5 hours ago'
        }
      ]
    }
  ])

  const suggestedFriends: User[] = [
    {
      id: 'Bảo Thông',
      name: 'Bảo Thông',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s',
      title: 'Financial Analyst'
    },
    {
      id: 'sf2',
      name: 'Nguyễn Văn A',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s',
      title: 'Project Manager'
    }
  ]

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment${Date.now()}`,
              user: {
                id: 'currentUser',
                name: 'You',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                title: 'Software Developer'
              },
              content: newComment,
              createdAt: 'Just now'
            }
          ]
        }
      }
      return post
    })

    setPosts(updatedPosts)
    setNewComment('')
  }

  return (
    <div className="homepage">
      <div className='container pb-5 mt-4'>
        <div className='row'>
          <div className='col-md-8'>
            {/* Create post section */}
            <div className="create-post-card card mb-4">
              <div className="card-body d-flex align-items-center">
                <img src={
                  profile?.avatar
                    ? profile.avatar
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'
                } className="rounded-circle me-3" alt="Profile" width="48" height="48" />
                <div className="form-control bg-light border-0 rounded-pill flex-grow-1">What's on your mind?</div>
                <button className="btn ms-3 d-flex align-items-center">
                  <i className="bi bi-image me-2"></i>
                  Add Media
                </button>
                <button className="btn btn-primary ms-2 rounded-pill px-4">Post</button>
              </div>
            </div>

            {/* Posts */}
            {posts.map(post => (
              <div key={post.id} className="post-card card mb-4">
                <div className="card-body">
                  {/* Post header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <img src={post.user.avatar} className="rounded-circle me-2" alt={post.user.name} width="48" height="48" />
                      <div>
                        <h6 className="mb-0">{post.user.name}</h6>
                        <small className="text-muted">{post.user.title}</small>
                        <small className="text-muted d-block">{post.createdAt}</small>
                      </div>
                    </div>
                    <div className="dropdown">
                      <button className="btn" data-bs-toggle="dropdown">
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item">Edit</button></li>
                        <li><button className="dropdown-item">Delete</button></li>
                        <li><button className="dropdown-item">Report</button></li>
                      </ul>
                    </div>
                  </div>

                  {/* Post content */}
                  <p>{post.content}</p>

                  {/* Post actions */}
                  <div className="d-flex border-top border-bottom py-2 mt-3">
                    <button className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center">
                      <i className="bi bi-hand-thumbs-up me-2"></i> Like
                    </button>
                    <button 
                      className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center"
                      onClick={() => setShowComments(!showComments)}
                    >
                      <i className="bi bi-chat me-2"></i> Comment
                    </button>
                  </div>

                  {/* Comments section */}
                  {showComments && (
                    <div className="comments-section mt-3">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="comment d-flex mb-3">
                          <img src={comment.user.avatar} className="rounded-circle me-2" alt={comment.user.name} width="36" height="36" />
                          <div className="comment-bubble">
                            <div className="bg-light rounded p-2">
                              <h6 className="mb-0">{comment.user.name}</h6>
                              <p className="mb-0">{comment.content}</p>
                            </div>
                            <small className="text-muted">{comment.createdAt}</small>
                          </div>
                        </div>
                      ))}

                      {/* Add comment */}
                      <div className="add-comment d-flex mt-3">
                        <img src={
                  profile?.avatar
                    ? profile.avatar
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'
                } className="rounded-circle me-2" alt="Your profile" width="36" height="36" />
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control rounded-pill"
                            placeholder="Write a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          />
                          <button 
                            className="btn btn-primary rounded-circle ms-2"
                            onClick={() => handleAddComment(post.id)}
                          >
                            <i className="bi bi-send"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right sidebar */}
          <div className='col-md-4'>
            <div className="card">
              <div className="card-header bg-white">
                <h5 className="mb-0">Suggested Friends</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {suggestedFriends.map(friend => (
                    <li key={friend.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src={friend.avatar} className="rounded-circle me-2" alt={friend.name} width="40" height="40" />
                        <div>
                          <h6 className="mb-0">{friend.name}</h6>
                          <small className="text-muted">{friend.title}</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary rounded-circle">
                        <i className="bi bi-plus"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-body text-center text-muted">
                <small>© 2023 DevCut. All rights reserved.</small>
                <div className="mt-2">
                  <a href="#" className="text-decoration-none text-muted small me-2">About</a>
                  <a href="#" className="text-decoration-none text-muted small me-2">Help</a>
                  <a href="#" className="text-decoration-none text-muted small">Privacy & Terms</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
