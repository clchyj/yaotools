import { useState } from 'react'
import { Layout } from '../components/Layout'
import { PrivateRoute } from '../components/PrivateRoute'
import { useAuthStore } from '../lib/store'
import { supabase } from '../lib/supabase'
import { Gift, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react'

export const Redeem = () => {
  const { user, userProfile, fetchUserProfile } = useAuthStore()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showWechat, setShowWechat] = useState(false)

  const redeemCode = async () => {
    if (!code.trim()) {
      setError('请输入授权码')
      return
    }

    if (!user) {
      setError('用户未登录')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Check if code exists and is unused
      const { data: authCode, error: fetchError } = await supabase
        .from('auth_codes')
        .select('*')
        .eq('code', code.trim())
        .eq('is_used', false)
        .single()

      if (fetchError || !authCode) {
        setError('无效的授权码或授权码已被使用')
        setLoading(false)
        return
      }

      // Mark code as used and update user usage
      const { error: updateCodeError } = await supabase
        .from('auth_codes')
        .update({
          is_used: true,
          used_by: user.id,
          used_at: new Date().toISOString()
        })
        .eq('id', authCode.id)

      if (updateCodeError) throw updateCodeError

      // Calculate uses to add (handle unlimited uses case)
      const usesToAdd = authCode.uses === -1 ? 999 : authCode.uses
      
      // Update user remaining uses
      const currentUses = userProfile?.remaining_uses || 0
      const newUses = currentUses + usesToAdd
      
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ remaining_uses: newUses })
        .eq('id', user.id)

      if (updateUserError) {
        console.error('Error updating user uses:', updateUserError)
        throw new Error('未能增加次数')
      }

      const usesText = authCode.uses === -1 ? '无限制' : authCode.uses
      setSuccess(`成功兑换 ${usesText} 次使用权限！您现在有 ${newUses} 次使用机会。`)
      setCode('')
      
      // Refresh user profile
      await fetchUserProfile()
      
    } catch (error: any) {
      setError(error.message || '兑换失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      redeemCode()
    }
  }

  return (
    <PrivateRoute>
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Gift className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">兑换授权码</h1>
            <p className="text-gray-600">输入授权码以获得更多工具使用次数</p>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            {/* Current status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">当前状态</h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {userProfile?.remaining_uses || 0} 次
                  </p>
                  <p className="text-sm text-gray-600">剩余使用次数</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">账户类型</p>
                  <p className="font-medium">
                    {(userProfile?.is_premium || userProfile?.role === 'admin' || userProfile?.role === 'super_admin') ? '会员用户' : '普通用户'}
                  </p>
                </div>
              </div>
            </div>

            {/* Success message */}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {success}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {/* Redeem form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  授权码
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="请输入授权码 (例如: ABC123DEF456)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono tracking-wider"
                  maxLength={20}
                />
                <p className="mt-1 text-xs text-gray-500">
                  授权码由管理员提供，不区分大小写
                </p>
              </div>

              <button
                onClick={redeemCode}
                disabled={loading || !code.trim()}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Gift className="h-4 w-4 mr-2" />
                {loading ? '兑换中...' : '兑换授权码'}
              </button>
            </div>

            {/* How to get codes */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">如何获得授权码？</h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>联系客服获取授权码，扫描下方二维码添加微信</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>参与官方活动和推广获得奖励授权码</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p>成为会员用户享受更多使用次数</p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowWechat(!showWechat)}
                  className="inline-flex items-center text-primary-600 hover:text-primary-500"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {showWechat ? '隐藏' : '显示'}微信二维码
                </button>
              </div>

              {showWechat && (
                <div className="mt-4 text-center">
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img 
                      src="/image/wechat.jpg" 
                      alt="客服微信二维码" 
                      className="w-32 h-32 mx-auto rounded-lg border"
                    />
                    <p className="mt-2 text-xs text-gray-500">扫码添加客服微信</p>
                    <p className="text-xs text-gray-400">获取授权码和技术支持</p>
                  </div>
                </div>
              )}
            </div>

            {/* Usage instructions */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">使用说明</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 每个授权码只能使用一次</li>
                <li>• 授权码兑换后会立即增加您的使用次数</li>
                <li>• 如有问题请及时联系客服处理</li>
                <li>• 使用次数永久有效，不会过期</li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    </PrivateRoute>
  )
}