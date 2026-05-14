import { useNavigate } from 'react-router-dom'




export default function LoginPage() {
    const navigate = useNavigate()
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #03140d 0%, #0a3d2e 30%, #0f6e56 70%, #1d9e75 100%)'
      }}
    >
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-[-120px] left-[-120px] w-[350px] h-[350px] rounded-full bg-emerald-300/10 blur-3xl"></div>

      <div className="w-full max-w-5xl bg-white rounded-[32px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {/* Left Side */}
        <div
          className="hidden lg:flex flex-col justify-center p-14 text-white relative"
          style={{
            background: 'linear-gradient(135deg, #05281c 0%, #0f6e56 100%)'
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-10 w-52 h-52 rounded-full bg-white"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl backdrop-blur-md">
                📦
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  AssetHub
                </h1>

                <p className="text-white/70 text-sm mt-1">
                  Smart Asset Management Platform
                </p>
              </div>
            </div>

            <h2 className="text-5xl font-black leading-tight mb-6">
              Welcome
              <br />
              Back 👋
            </h2>

            <p className="text-lg text-white/75 leading-8 max-w-md mb-10">
              Access your organization dashboard, monitor assets, and manage operations securely from anywhere.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  🔐
                </div>
                <span className="text-lg">Secure authentication system</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  📊
                </div>
                <span className="text-lg">Real-time analytics dashboard</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  ⚡
                </div>
                <span className="text-lg">Fast and intelligent workflow</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-14 bg-white flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <div className="lg:hidden w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-5"
                style={{
                  background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)'
                }}
              >
                📦
              </div>

              <h2 className="text-4xl font-black text-slate-800 mb-3">
                Login Account
              </h2>

              <p className="text-slate-500 text-lg leading-7">
                Enter your credentials to continue
              </p>
            </div>

            <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization ID
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Enter your Organization ID"
                      className="flex-1 h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => {}}
                      className="h-14 px-6 rounded-2xl text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                      style={{ background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)' }}
                    >
                      Verify
                    </button>
                  </div>
                </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <span className="text-sm text-green-700 font-semibold cursor-pointer hover:underline">
                    Forgot Password?
                  </span>
                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-green-600"
                  />

                  <p className="text-sm text-slate-600 font-medium">
                    Remember me
                  </p>
                </div>

                <span className="text-sm text-slate-500">
                  Secure Login
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-2xl text-white font-bold text-lg transition hover:scale-[1.02] shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)'
                }}
              >
                Login to Dashboard
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 text-base">
                Don’t have an account?

                <span
                  onClick={() => navigate('/register')}
                  className="text-green-700 font-bold cursor-pointer ml-2 hover:underline"
                >
                  Create Account
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
