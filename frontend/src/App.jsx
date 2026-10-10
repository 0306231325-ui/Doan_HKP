import { useState } from 'react'
import api from './services/api'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (err) {
      setError('Không thể kết nối. Hãy chắc chắn Backend Laravel đang chạy ở port 8000!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Đồ Án HKP
          </h1>
          <p className="text-purple-100 font-medium text-sm">
            Thử nghiệm gọi api.get('/users')
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Đang kết nối...' : 'Lấy Danh Sách Users (api.js)'}
          </button>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          {users.length > 0 && !error && (
            <div className="bg-white/20 border border-white/30 rounded-xl p-4">
              <h2 className="text-white font-bold mb-3 border-b border-white/20 pb-2">Dữ liệu từ Backend:</h2>
              <ul className="space-y-2">
                {users.map(user => (
                  <li key={user.id} className="text-white text-sm bg-black/10 rounded px-3 py-2">
                    <span className="font-semibold">{user.name}</span> - {user.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
