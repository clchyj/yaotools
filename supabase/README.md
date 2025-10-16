# Supabase 设置指南

## 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 注册/登录账户
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - Organization: 选择或创建组织
   - Project name: `yaotools`
   - Database password: 设置强密码
   - Region: 选择就近地区

## 步骤 2: 获取项目配置

项目创建完成后，在项目设置页面获取：

- **Project URL**: `https://your-project-ref.supabase.co`
- **API Key (anon public)**: `eyJ...` 

## 步骤 3: 配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 步骤 4: 初始化数据库

1. 在 Supabase 控制台中，进入 "SQL Editor"
2. 复制 `schema.sql` 文件中的内容
3. 执行 SQL 脚本创建表结构和初始数据

## 步骤 5: 配置认证

在 Supabase 控制台的 "Authentication" > "Settings" 中：

1. **Site URL**: `http://localhost:5173` (开发环境)
2. **Redirect URLs**: 
   - `http://localhost:5173/**`
   - `https://your-production-domain.com/**` (生产环境)

## 验证设置

运行项目并测试：
1. 用户注册功能
2. 用户登录功能
3. 数据库连接
4. 表结构正确性

## 生产环境部署

部署时需要更新：
1. 环境变量中的 URL
2. Supabase 认证设置中的重定向 URL
3. RLS 政策（如需要）

## 故障排除

常见问题：
- **RLS错误**: 检查 RLS 政策是否正确设置
- **CORS错误**: 验证 Site URL 配置
- **权限错误**: 检查用户角色和权限设置