// 如果上面的修复仍有问题，可以使用这个更简单的版本
// 替换 fetchAuthCodes 函数

const fetchAuthCodes = async () => {
  try {
    // 只获取授权码基本信息，暂时不获取用户邮箱
    const { data, error } = await supabase
      .from('auth_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // 暂时设置 used_by_email 为空，避免关联查询问题
    const processedCodes = data?.map(code => ({
      ...code,
      used_by_email: code.used_by ? '用户已使用' : null
    })) || []

    setAuthCodes(processedCodes)
  } catch (error) {
    console.error('Error fetching auth codes:', error)
  } finally {
    setLoading(false)
  }
}