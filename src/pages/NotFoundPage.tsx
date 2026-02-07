import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="text-center py-20">
    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
    <p className="text-xl text-gray-600 mb-8">Page not found</p>
    <Link
      to="/feed"
      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Back to Feed
    </Link>
  </div>
)

export default NotFoundPage
