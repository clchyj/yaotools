import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'
import type { AuthCode } from '../../types'
import { Search, Plus, Copy, Gift, Calendar, User, RefreshCw } from 'lucide-react'
import QRCode from 'qrcode'

interface AuthCodeWithUser extends AuthCode {
  used_by_email?: string
}

export const AdminCodes = () => {
  const [authCodes, setAuthCodes] = useState<AuthCodeWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [selectedCode, setSelectedCode] = useState<AuthCodeWithUser | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')

  const [generateForm, setGenerateForm] = useState({
    uses: 10,
    isPermanent: false,
    count: 1
  })

  useEffect(() => {
    fetchAuthCodes()
  }, [])

  const fetchAuthCodes = async () => {
    try {
      // 获取授权码基本信息
      const { data: authCodesData, error: authCodesError } = await supabase
        .from('auth_codes')
        .select('*')
        .order('created_at', { ascending: false })

      if (authCodesError) throw authCodesError

      // 获取所有相关用户信息（批量查询）
      const userIds = authCodesData
        ?.filter(code => code.used_by)
        .map(code => code.used_by) || []
      
      let usersMap = new Map()
      
      if (userIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, email')
          .in('id', userIds)
        
        usersData?.forEach(user => {
          usersMap.set(user.id, user.email)
        })
      }

      // 组合数据
      const processedCodes = authCodesData?.map(code => ({
        ...code,
        used_by_email: code.used_by ? usersMap.get(code.used_by) : null
      })) || []

      setAuthCodes(processedCodes)
    } catch (error) {
      console.error('Error fetching auth codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAuthCodes = async () => {
    try {
      setGenerating(true)
      
      const codes = []
      for (let i = 0; i < generateForm.count; i++) {
        const code = Math.random().toString(36).substr(2, 12).toUpperCase()
        codes.push({
          code,
          uses: generateForm.isPermanent ? -1 : generateForm.uses,
          is_used: false
        })
      }

      const { error } = await supabase
        .from('auth_codes')
        .insert(codes)

      if (error) throw error

      alert(`成功生成 ${generateForm.count} 个授权码！`)
      setShowGenerateForm(false)
      setGenerateForm({ uses: 10, isPermanent: false, count: 1 })
      fetchAuthCodes()
    } catch (error) {
      console.error('Error generating auth codes:', error)
      alert('生成授权码失败')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const showCodeDetails = async (code: AuthCodeWithUser) => {
    setSelectedCode(code)
    
    // 生成二维码
    try {
      const redeemUrl = `${window.location.origin}/redeem?code=${code.code}`
      const qrDataUrl = await QRCode.toDataURL(redeemUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeDataUrl(qrDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
      setQrCodeDataUrl('')
    }
  }

  const filteredCodes = authCodes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.used_by_email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'used' && code.is_used) ||
      (statusFilter === 'unused' && !code.is_used)

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (code: AuthCodeWithUser) => {
    if (code.is_used) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">已使用</span>
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">可使用</span>
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">授权码管理</h1>
            <p className="mt-1 text-sm text-gray-600">
              生成和管理系统授权码
            </p>
          </div>
          <button
            onClick={() => setShowGenerateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            生成授权码
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-indigo-500">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">总授权码</p>
                <p className="text-2xl font-semibold text-gray-900">{authCodes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-green-500">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">可使用</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {authCodes.filter(code => !code.is_used).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-red-500">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">已使用</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {authCodes.filter(code => code.is_used).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-orange-500">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">使用率</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round((authCodes.filter(code => code.is_used).length / Math.max(authCodes.length, 1)) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="搜索授权码..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">所有状态</option>
              <option value="unused">可使用</option>
              <option value="used">已使用</option>
            </select>

            <div className="flex items-center text-sm text-gray-500">
              共 {filteredCodes.length} 个授权码
            </div>
          </div>
        </div>

        {/* Auth Codes Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  授权码
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用次数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCodes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {code.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(code.code)}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        title="复制"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(code)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {code.uses === -1 ? '无限制' : code.uses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.used_by_email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(code.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => showCodeDetails(code)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generate Form Modal */}
        {showGenerateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">生成授权码</h3>
                <button
                  onClick={() => setShowGenerateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">关闭</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">生成数量</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={generateForm.count}
                    onChange={(e) => setGenerateForm(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={generateForm.isPermanent}
                      onChange={(e) => setGenerateForm(prev => ({ ...prev, isPermanent: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">永久使用（无限次数）</span>
                  </label>
                </div>

                {!generateForm.isPermanent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">使用次数</label>
                    <input
                      type="number"
                      min="1"
                      value={generateForm.uses}
                      onChange={(e) => setGenerateForm(prev => ({ ...prev, uses: parseInt(e.target.value) || 1 }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  取消
                </button>
                <button
                  onClick={generateAuthCodes}
                  disabled={generating}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {generating ? '生成中...' : '生成'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Code Details Modal */}
        {selectedCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">授权码详情</h3>
                <button
                  onClick={() => setSelectedCode(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">关闭</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <code className="text-lg font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded">
                    {selectedCode.code}
                  </code>
                  <button
                    onClick={() => copyToClipboard(selectedCode.code)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                    title="复制"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                {qrCodeDataUrl && (
                  <div className="text-center">
                    <img src={qrCodeDataUrl} alt="二维码" className="mx-auto mb-2" />
                    <p className="text-sm text-gray-500">扫描二维码直接兑换</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">状态</dt>
                    <dd className="mt-1">{getStatusBadge(selectedCode)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">使用次数</dt>
                    <dd className="mt-1 text-gray-900">
                      {selectedCode.uses === -1 ? '无限制' : selectedCode.uses}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">创建时间</dt>
                    <dd className="mt-1 text-gray-900">
                      {new Date(selectedCode.created_at).toLocaleDateString('zh-CN')}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">使用者</dt>
                    <dd className="mt-1 text-gray-900">
                      {selectedCode.used_by_email || '未使用'}
                    </dd>
                  </div>
                </div>

                <div>
                  <dt className="font-medium text-gray-500">兑换链接</dt>
                  <dd className="mt-1">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={`${window.location.origin}/redeem?code=${selectedCode.code}`}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/redeem?code=${selectedCode.code}`)}
                        className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                        title="复制链接"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </dd>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedCode(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}