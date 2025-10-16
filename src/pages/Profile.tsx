import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { PrivateRoute } from '../components/PrivateRoute'
import { useAuthStore } from '../lib/store'
import { supabase, type UsageLog } from '../lib/supabase'
import { User, History, Key, Settings, Eye, EyeOff, Save } from 'lucide-react'

export const Profile = () => {
  const { user, userProfile, fetchUserProfile } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([])
  const [loading, setLoading] = useState(false)
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    username: userProfile?.username || '',
    email: userProfile?.email || ''
  })
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        username: userProfile.username || '',
        email: userProfile.email || ''
      })
    }
  }, [userProfile])

  useEffect(() => {
    if (activeTab === 'usage' && user) {
      fetchUsageLogs()
    }
  }, [activeTab, user])

  const fetchUsageLogs = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('usage_logs')
        .select(`
          *,
          tools (name, category)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setUsageLogs(data || [])
    } catch (error) {
      console.error('Error fetching usage logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!user) return
    
    setLoading(true)
    setError('')
    setMessage('')
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: profileData.username || null
        })
        .eq('id', user.id)

      if (error) throw error
      
      setMessage('个人资料更新成功')
      await fetchUserProfile()
    } catch (error: any) {
      setError(error.message || '更新失败')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('新密码和确认密码不一致')
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('新密码长度至少为6位')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error
      
      setMessage('密码修改成功')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      setError(error.message || '密码修改失败')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const tabs = [
    { id: 'profile', name: '个人资料', icon: User },
    { id: 'usage', name: '使用记录', icon: History },
    { id: 'password', name: '修改密码', icon: Key },
  ]

  return (
    <PrivateRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">个人中心</h1>
            <p className="mt-1 text-sm text-gray-600">管理您的个人资料和账户设置</p>
          </div>

          <div className="bg-white shadow rounded-lg">
            {/* Tab navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {/* Success/Error messages */}
              {message && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                  {message}
                </div>
              )}
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Profile tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
                    <p className="mt-1 text-sm text-gray-600">更新您的个人资料信息</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">邮箱地址</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">邮箱地址不可修改</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">用户名</label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="请输入用户名"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">使用统计</h4>
                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600">
                          {userProfile?.remaining_uses || 0}
                        </div>
                        <div className="text-sm text-gray-600">剩余次数</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {userProfile?.is_premium ? '会员' : '普通'}
                        </div>
                        <div className="text-sm text-gray-600">账户类型</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {userProfile?.created_at ? formatDate(userProfile.created_at).split(' ')[0] : ''}
                        </div>
                        <div className="text-sm text-gray-600">注册时间</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={updateProfile}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? '保存中...' : '保存更改'}
                    </button>
                  </div>
                </div>
              )}

              {/* Usage logs tab */}
              {activeTab === 'usage' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">使用记录</h3>
                    <p className="mt-1 text-sm text-gray-600">查看您最近的工具使用记录</p>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded">
                          <div className="h-10 w-10 bg-gray-300 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : usageLogs.length > 0 ? (
                    <div className="space-y-3">
                      {usageLogs.map((log: any) => (
                        <div key={log.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Settings className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                {log.tools?.name || '未知工具'}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {formatDate(log.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              分类: {log.tools?.category || '未知'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <History className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">暂无使用记录</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        开始使用工具后，记录会显示在这里
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Password tab */}
              {activeTab === 'password' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">修改密码</h3>
                    <p className="mt-1 text-sm text-gray-600">更新您的账户密码</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">当前密码</label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">新密码</label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">确认新密码</label>
                      <div className="mt-1 relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={changePassword}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {loading ? '修改中...' : '修改密码'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  )
}