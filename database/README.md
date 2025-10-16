# 数据库设置说明

## 错误原因
目前报错是因为数据库中还没有 `ai_models` 和 `chat_messages` 表。需要先在 Supabase 数据库中创建这些表。

## 设置步骤

### 1. 登录 Supabase Dashboard
1. 访问 [https://supabase.com](https://supabase.com)
2. 登录您的账户
3. 选择您的项目

### 2. 创建数据库表
1. 在左侧导航栏点击 **SQL Editor**
2. 点击 **New Query** 创建新查询
3. 复制以下SQL代码并执行：

#### 方法一：使用完整版SQL（推荐）
复制 `ai_models_schema.sql` 文件中的所有内容并执行。

#### 方法二：使用简化版SQL
如果完整版出现问题，可以使用 `ai_models_schema_simple.sql` 文件中的内容。

### 3. 验证表创建
执行以下查询验证表是否创建成功：
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ai_models', 'chat_messages');
```

### 4. 配置API Key
创建表后，需要更新默认模型的 API Key：

1. 获取 OpenRouter API Key：
   - 访问 [https://openrouter.ai](https://openrouter.ai)
   - 注册并获取 API Key

2. 更新数据库中的 API Key：
```sql
UPDATE public.ai_models 
SET api_key = 'your-actual-openrouter-api-key-here'
WHERE model_name = 'deepseek/deepseek-r1-0528:free';
```

### 5. 测试功能
完成以上步骤后：
1. 刷新您的应用
2. 以管理员身份登录
3. 访问 "AI模型管理" 页面
4. 应该能看到默认的 DeepSeek 模型
5. 点击测试连接验证配置

## 表结构说明

### ai_models 表
存储AI模型配置信息：
- `id`: 主键
- `name`: 模型显示名称
- `model_name`: API调用的模型名称
- `api_url`: API端点URL
- `api_key`: API密钥
- `description`: 模型描述
- `max_tokens`: 最大Token数
- `temperature`: 温度参数
- `is_active`: 是否启用
- `is_default`: 是否为默认模型

### chat_messages 表
存储聊天记录：
- `id`: 主键
- `user_id`: 用户ID
- `model_id`: 模型ID
- `user_message`: 用户消息
- `ai_response`: AI回复
- `tokens_used`: 使用的Token数
- `created_at`: 创建时间

## 权限配置
表已配置了行级安全（RLS）策略：
- 只有管理员可以管理AI模型
- 用户只能查看活跃的模型
- 用户只能访问自己的聊天记录

## 故障排除

如果遇到问题：
1. 确认您有管理员权限
2. 检查 Supabase 项目是否正确配置
3. 验证环境变量是否正确设置
4. 查看浏览器控制台的详细错误信息