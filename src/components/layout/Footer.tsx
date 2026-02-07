import React from 'react'

export const Footer = React.memo(() => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ContentHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-gray-400">
              Built with React + Redux Toolkit
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'
