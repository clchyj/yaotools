-- 创建 AI 模型配置表（简化版）
CREATE TABLE public.ai_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    model_name TEXT NOT NULL,
    api_url TEXT NOT NULL DEFAULT 'https://openrouter.ai/api/v1/chat/completions',
    api_key TEXT NOT NULL,
    description TEXT,
    max_tokens INTEGER DEFAULT 1000,
    temperature NUMERIC DEFAULT 0.7,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建聊天消息表（简化版）
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    model_id UUID NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    tokens_used INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建基本索引
CREATE INDEX IF NOT EXISTS idx_ai_models_active ON public.ai_models(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_models_default ON public.ai_models(is_default);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- 插入默认示例模型（请替换为真实的API Key）
INSERT INTO public.ai_models (
    name,
    model_name,
    api_url,
    api_key,
    description,
    max_tokens,
    temperature,
    is_active,
    is_default
) VALUES (
    'DeepSeek R1 Free',
    'deepseek/deepseek-r1-0528:free',
    'https://openrouter.ai/api/v1/chat/completions',
    'your-api-key-here',
    'DeepSeek R1 免费版本',
    1000,
    0.7,
    true,
    true
) ON CONFLICT DO NOTHING;