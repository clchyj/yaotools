import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuthStore } from '../lib/store'
import { getEmailProviderUrl, getEmailProviderName } from '../utils/emailProviders'
import { Eye, EyeOff, UserPlus, Mail, ExternalLink, AlertCircle } from 'lucide-react'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [existingUserAlert, setExistingUserAlert] = useState('')
  
  const { signUp } = useAuthStore()
  // const navigate = useNavigate() // Will be used for redirect after registration


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setExistingUserAlert('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少6位')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, username)
      setRegisteredEmail(email)
      setSuccess(true)
    } catch (error: any) {
      // If registration fails due to existing user, show appropriate message
      if (error.message?.includes('User already registered') || 
          error.message?.includes('already') || 
          error.message?.includes('已经')) {
        setExistingUserAlert(`该邮箱 ${email} 已经注册，请直接登录或检查邮箱完成验证。`)
      } else {
        setError(error.message || '注册失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  // Email confirmation success component
  if (success) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                注册成功！
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                我们已经向 <span className="font-medium text-primary-600">{registeredEmail}</span> 发送了一封确认邮件
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    请检查您的邮箱
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>为了完成注册，请按照以下步骤操作：</p>
                    <ol className="mt-2 list-decimal list-inside space-y-1">
                      <li>打开您的邮箱应用</li>
                      <li>查找来自 YaoTools 的确认邮件</li>
                      <li>点击邮件中的确认链接</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.open(getEmailProviderUrl(registeredEmail), '_blank')}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                打开 {getEmailProviderName(registeredEmail)}
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  没收到邮件？请检查垃圾邮件文件夹或{' '}
                  <button 
                    onClick={() => {
                      setSuccess(false)
                      setError('')
                      setEmail('')
                      setPassword('')
                      setConfirmPassword('')
                      setUsername('')
                    }}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    重新注册
                  </button>
                </p>
              </div>
              
              <div className="text-center">
                <Link
                  to="/login"
                  state={{ message: '注册成功！请检查邮箱并完成验证后登录。' }}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  返回登录页面
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              创建新账户
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              已有账户？{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                立即登录
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {existingUserAlert && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{existingUserAlert}</p>
                  <div className="mt-2 flex space-x-2">
                    <Link
                      to="/login"
                      className="text-yellow-700 hover:text-yellow-900 underline text-sm font-medium"
                    >
                      前去登录
                    </Link>
                    <span className="text-yellow-600">|</span>
                    <button
                      type="button"
                      onClick={() => setExistingUserAlert('')}
                      className="text-yellow-700 hover:text-yellow-900 underline text-sm font-medium"
                    >
                      继续注册
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  用户名 (可选)
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="请输入用户名"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  邮箱地址
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="请输入邮箱"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="请输入密码 (至少6位)"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  确认密码
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="请再次输入密码"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>注册即表示您同意我们的{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  服务条款
                </Link>
                {' '}和{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                  隐私政策
                </Link>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '注册中...' : '立即注册'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}