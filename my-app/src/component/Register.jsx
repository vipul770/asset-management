import { useNavigate } from 'react-router-dom'


export default function RegisterPage() {
  const navigate = useNavigate()
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: 'linear-gradient(135deg, #0a3d2e 0%, #0f6e56 50%, #1d9e75 100%)'
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12 bg-white">
          <div className="max-w-md mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-black text-slate-800 mb-3">
                Create Account
              </h2>

              <p className="text-slate-500 text-lg">
                Register your organization account
              </p>
            </div>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name
                </label>

                <input
                  type="text"
                  placeholder="Enter company name"
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Organization Type
                </label>

                <select
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                >
                  <option>Select organization type</option>
                  <option>IT Company</option>
                  <option>Manufacturing</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Retail</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 accent-green-600"
                />

                <p className="text-sm text-slate-600 leading-6">
                  I agree to the Terms & Conditions and Privacy Policy.
                </p>
              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-2xl text-white font-bold text-lg transition hover:scale-[1.02] shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)'
                }}
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500">
                Already have an account?
                <span onClick={() => navigate('/login')} className="text-green-700 font-semibold cursor-pointer ml-2 hover:underline">
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
