// Email provider URL mappings
const emailProviders: Record<string, string> = {
  'gmail.com': 'https://mail.google.com',
  'googlemail.com': 'https://mail.google.com',
  'yahoo.com': 'https://mail.yahoo.com',
  'yahoo.cn': 'https://mail.yahoo.com',
  'hotmail.com': 'https://outlook.live.com',
  'outlook.com': 'https://outlook.live.com',
  'live.com': 'https://outlook.live.com',
  'msn.com': 'https://outlook.live.com',
  '163.com': 'https://mail.163.com',
  '126.com': 'https://mail.126.com',
  'qq.com': 'https://mail.qq.com',
  'foxmail.com': 'https://mail.qq.com',
  'sina.com': 'https://mail.sina.com',
  'sina.cn': 'https://mail.sina.com',
  'sohu.com': 'https://mail.sohu.com',
  'aliyun.com': 'https://mail.aliyun.com',
  'alibaba.com': 'https://mail.alibaba.com'
}

/**
 * Get the appropriate email provider URL for a given email address
 * @param email - The email address
 * @returns The URL to open the email provider, or a generic URL if provider is unknown
 */
export function getEmailProviderUrl(email: string): string {
  if (!email || !email.includes('@')) {
    return 'https://mail.google.com' // fallback
  }
  
  const domain = email.split('@')[1]?.toLowerCase()
  
  if (domain && emailProviders[domain]) {
    return emailProviders[domain]
  }
  
  // For unknown providers, try a generic webmail URL
  return `https://mail.${domain}`
}

/**
 * Get the display name for an email provider
 * @param email - The email address
 * @returns A user-friendly name for the email provider
 */
export function getEmailProviderName(email: string): string {
  if (!email || !email.includes('@')) {
    return '邮箱'
  }
  
  const domain = email.split('@')[1]?.toLowerCase()
  
  const providerNames: Record<string, string> = {
    'gmail.com': 'Gmail',
    'googlemail.com': 'Gmail',
    'yahoo.com': 'Yahoo Mail',
    'yahoo.cn': 'Yahoo Mail',
    'hotmail.com': 'Outlook',
    'outlook.com': 'Outlook',
    'live.com': 'Outlook',
    'msn.com': 'Outlook',
    '163.com': '网易邮箱',
    '126.com': '网易邮箱',
    'qq.com': 'QQ邮箱',
    'foxmail.com': 'QQ邮箱',
    'sina.com': '新浪邮箱',
    'sina.cn': '新浪邮箱',
    'sohu.com': '搜狐邮箱',
    'aliyun.com': '阿里云邮箱',
    'alibaba.com': '阿里巴巴邮箱'
  }
  
  return domain && providerNames[domain] ? providerNames[domain] : '邮箱'
}