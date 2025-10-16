# YaoTools - 多功能工具类网站平台

## 项目概述

YaoTools 是基于 Supabase 的插件化工具网站，提供用户注册登录、工具管理、试用机制和付费授权等功能。管理员可上传工具代码，用户可在线使用各类实用工具。

### 技术栈
- **前端**: React + TypeScript + Vite
- **后端**: Supabase (Postgres + Auth + Storage + Edge Functions)
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **图标**: Lucide React

## 功能特性

### 用户管理
- ✅ 邮箱注册验证
- ✅ 用户登录/登出
- ✅ 个人资料管理
- ✅ 使用次数追踪

### 工具系统
- 🔄 工具列表展示
- 🔄 工具分类管理
- 🔄 在线工具执行
- 🔄 使用统计

### 权限控制
- 🔄 免费试用机制
- 🔄 授权码系统
- 🔄 微信联系方式

### 管理后台
- 🔄 工具管理
- 🔄 用户管理
- 🔄 授权码管理
- 🔄 数据统计

## 开发指南

### 环境要求
- Node.js 18+
- npm/yarn/pnpm
- Supabase 账户

### 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置 Supabase**
   - 按照 `supabase/README.md` 中的步骤创建 Supabase 项目
   - 复制 `.env.example` 为 `.env` 并填入正确的配置
   ```bash
   cp .env.example .env
   ```

3. **运行开发服务器**
   ```bash
   npm run dev
   ```

4. **类型检查**
   ```bash
   npm run type-check
   ```

### 项目结构
```
yaotools/
├── src/
│   ├── components/     # React 组件
│   ├── pages/         # 页面组件
│   ├── hooks/         # 自定义 Hooks
│   ├── utils/         # 工具函数
│   ├── types/         # TypeScript 类型定义
│   └── lib/           # 第三方库配置
├── supabase/          # Supabase 配置
├── public/            # 静态资源
└── docs/              # 项目文档
```

## 数据库设计

### 核心表结构
- **users**: 用户信息和使用次数
- **tools**: 工具信息和代码
- **usage_logs**: 使用记录
- **auth_codes**: 授权码管理

详细的数据库schema请查看 `supabase/schema.sql`

## 部署

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 预览构建
```bash
npm run preview
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 发起 Pull Request

## 许可证

MIT License

---

**状态**: 🚧 开发中
**版本**: v0.1.0
