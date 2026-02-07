import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface HeaderProps {
  isAuthenticated: boolean
  userName?: string
  onLogout: () => void
}

export const Header = React.memo<HeaderProps>(
  ({ isAuthenticated, userName, onLogout }) => {
    const navigate = useNavigate()

    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/feed" className="text-xl font-bold text-blue-600">
                ContentHub
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/feed"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Feed
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/bookmarks"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Bookmarks
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/settings')}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-600">{userName}</span>
                  <button
                    onClick={onLogout}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    )
  },
)

Header.displayName = 'Header'
