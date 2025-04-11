const friends = [
  { name: 'Olivia Anderson', job: 'Financial Analyst' },
  { name: 'Thomas Baker', job: 'Project Manager' },
  { name: 'Lily Lee', job: 'Graphic Designer' },
  { name: 'Andrew Harris', job: 'Data Scientist' }
]

const SuggestedFriends = () => {
  return (
    <div className='w-64 bg-white shadow rounded-lg p-4 '>
      <h2 className='text-lg font-semibold mb-4'>Suggested Friends</h2>
      <ul>
        {friends.map((friend, index) => (
          <li key={index} className='flex justify-between items-center mb-3'>
            <div>
              <h3 className='text-sm font-medium'>{friend.name}</h3>
              <p className='text-xs text-gray-500'>{friend.job}</p>
            </div>
            <button className='text-blue-500 border border-blue-500 px-2 py-1 rounded text-xs'>+</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SuggestedFriends
