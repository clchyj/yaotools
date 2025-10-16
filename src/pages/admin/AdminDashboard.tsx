import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Users, Wrench, Gift, Activity, TrendingUp, Eye } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalTools: number
  totalAuthCodes: number
  totalUsageLogs: number
  activeTools: number
  usedAuthCodes: number
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTools: 0,
    totalAuthCodes: 0,
    totalUsageLogs: 0,
    activeTools: 0,
    usedAuthCodes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [
        usersResult,
        toolsResult,
        authCodesResult,
        usageLogsResult,
        activeToolsResult,
        usedCodesResult
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('tools').select('id', { count: 'exact', head: true }),
        supabase.from('auth_codes').select('id', { count: 'exact', head: true }),
        supabase.from('usage_logs').select('id', { count: 'exact', head: true }),
        supabase.from('tools').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('auth_codes').select('id', { count: 'exact', head: true }).eq('is_used', true)
      ])

      setStats({
        totalUsers: usersResult.count || 0,
        totalTools: toolsResult.count || 0,
        totalAuthCodes: authCodesResult.count || 0,
        totalUsageLogs: usageLogsResult.count || 0,
        activeTools: activeToolsResult.count || 0,
        usedAuthCodes: usedCodesResult.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    subValue, 
    subLabel, 
    icon: Icon, 
    color 
  }: {
    title: string
    value: number
    subValue?: number
    subLabel?: string
    icon: React.ElementType
    color: string
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-md ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subValue !== undefined && subLabel && (
            <p className="text-sm text-gray-500">
              {subLabel}: {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
                  <div className="ml-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <p className="mt-1 text-sm text-gray-600">
            网站运营数据总览
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="总用户数"
            value={stats.totalUsers}
            icon={Users}
            color="bg-blue-500"
          />
          
          <StatCard
            title="工具数量"
            value={stats.totalTools}
            subValue={stats.activeTools}
            subLabel="启用"
            icon={Wrench}
            color="bg-green-500"
          />
          
          <StatCard
            title="授权码"
            value={stats.totalAuthCodes}
            subValue={stats.usedAuthCodes}
            subLabel="已使用"
            icon={Gift}
            color="bg-purple-500"
          />
          
          <StatCard
            title="总使用次数"
            value={stats.totalUsageLogs}
            icon={Activity}
            color="bg-orange-500"
          />
          
          <StatCard
            title="活跃工具"
            value={stats.activeTools}
            icon={TrendingUp}
            color="bg-indigo-500"
          />
          
          <StatCard
            title="授权码使用率"
            value={Math.round((stats.usedAuthCodes / Math.max(stats.totalAuthCodes, 1)) * 100)}
            icon={Eye}
            color="bg-pink-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">快速操作</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/admin/tools/new"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Wrench className="h-8 w-8 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-600">添加新工具</span>
              </a>
              
              <a
                href="/admin/codes/generate"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Gift className="h-8 w-8 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-600">生成授权码</span>
              </a>
              
              <a
                href="/admin/users"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Users className="h-8 w-8 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-600">管理用户</span>
              </a>
              
              <a
                href="/admin/logs"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Activity className="h-8 w-8 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-600">查看日志</span>
              </a>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">系统信息</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="font-medium text-gray-500">平台版本</dt>
                <dd className="mt-1 text-gray-900">YaoTools v1.0.0</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">数据库状态</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    正常
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">最后更新</dt>
                <dd className="mt-1 text-gray-900">{new Date().toLocaleDateString('zh-CN')}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}