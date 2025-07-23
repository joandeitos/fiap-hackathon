'use client'

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            EduMarketplace
          </h1>
          <p className="text-gray-300">
            Crie sua conta e comece a transformar a educação
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
                card: 'shadow-none',
                headerTitle: 'text-2xl font-bold text-gray-800',
                headerSubtitle: 'text-gray-600',
                socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
                formFieldInput: 'border-gray-200 focus:border-blue-500',
                footerActionLink: 'text-blue-600 hover:text-blue-700'
              }
            }}
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  )
}

