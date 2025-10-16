-- 创建 AI 模型配置表
CREATE TABLE public.ai_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model_name VARCHAR(200) NOT NULL,
    api_url TEXT NOT NULL DEFAULT 'https://openrouter.ai/api/v1/chat/completions',
    api_key TEXT NOT NULL,
    description TEXT,
    max_tokens INTEGER DEFAULT 1000,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建聊天消息表
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    model_id UUID REFERENCES public.ai_models(id) ON DELETE CASCADE NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX idx_ai_models_active ON public.ai_models(is_active);
CREATE INDEX idx_ai_models_default ON public.ai_models(is_default);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_model_id ON public.chat_messages(model_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);

-- 添加约束确保只有一个默认模型
CREATE UNIQUE INDEX idx_ai_models_unique_default ON public.ai_models(is_default) WHERE is_default = true;

-- 创建更新时间自动更新的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_models_updated_at 
    BEFORE UPDATE ON public.ai_models 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 设置 RLS (Row Level Security) 政策
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- AI 模型表的 RLS 政策 - 只有管理员可以管理
CREATE POLICY "Admin can manage AI models" ON public.ai_models
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- 用户可以查看活跃的 AI 模型
CREATE POLICY "Users can view active AI models" ON public.ai_models
    FOR SELECT USING (is_active = true);

-- 聊天消息的 RLS 政策 - 用户只能操作自己的消息
CREATE POLICY "Users can manage own chat messages" ON public.chat_messages
    FOR ALL USING (auth.uid() = user_id);

-- 插入一个默认的 DeepSeek 模型配置示例（需要替换真实的 API Key）
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
    'your-openrouter-api-key-here',
    'DeepSeek R1 免费版本 - 支持推理和对话',
    1000,
    0.7,
    true,
    true
);

COMMENT ON TABLE public.ai_models IS '存储 AI 模型配置信息';
COMMENT ON TABLE public.chat_messages IS '存储用户与 AI 的聊天记录';