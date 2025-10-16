-- 管理后台相关数据库更新

-- 添加管理员角色枚举
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');

-- 更新用户表添加角色字段
ALTER TABLE users ADD COLUMN role user_role DEFAULT 'user';

-- 更新工具表支持代码存储
ALTER TABLE tools 
ADD COLUMN html_code TEXT,
ADD COLUMN css_code TEXT,
ADD COLUMN js_code TEXT,
ADD COLUMN tool_type VARCHAR DEFAULT 'code' CHECK (tool_type IN ('code', 'external')),
ADD COLUMN is_sandbox BOOLEAN DEFAULT true;

-- 更新授权码表支持永久使用
ALTER TABLE auth_codes 
ADD COLUMN is_permanent BOOLEAN DEFAULT false,
ADD COLUMN created_by UUID REFERENCES users(id);

-- 创建管理员日志表
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR NOT NULL,
  target_type VARCHAR,
  target_id VARCHAR,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 管理员日志 RLS 策略
CREATE POLICY "Only admins can view admin logs" ON admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Only admins can insert admin logs" ON admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 更新工具表 RLS 策略
DROP POLICY IF EXISTS "Tools are viewable by everyone" ON tools;

CREATE POLICY "Active tools are viewable by everyone" ON tools 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all tools" ON tools 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage tools" ON tools 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 授权码表 RLS 策略更新
DROP POLICY IF EXISTS "Auth codes are viewable by authenticated users" ON auth_codes;
DROP POLICY IF EXISTS "Auth codes can be updated by authenticated users" ON auth_codes;

CREATE POLICY "Users can view unused auth codes for redemption" ON auth_codes
  FOR SELECT USING (
    auth.role() = 'authenticated' AND is_used = false
  );

CREATE POLICY "Users can update auth codes when redeeming" ON auth_codes
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND is_used = false
  );

CREATE POLICY "Admins can manage auth codes" ON auth_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 创建管理员检查函数
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建超级管理员检查函数
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建记录管理员操作的函数
CREATE OR REPLACE FUNCTION log_admin_action(
  action_name TEXT,
  target_type TEXT DEFAULT NULL,
  target_id TEXT DEFAULT NULL,
  action_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), action_name, target_type, target_id, action_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 插入默认超级管理员（需要手动更新邮箱）
-- 注意：这里需要替换为实际的管理员邮箱
INSERT INTO users (id, email, username, role, remaining_uses, is_premium) 
VALUES (
  gen_random_uuid(),
  'admin@yaotools.com', -- 替换为实际管理员邮箱
  'SuperAdmin',
  'super_admin',
  999999,
  true
) ON CONFLICT (email) DO UPDATE SET 
  role = 'super_admin',
  remaining_uses = 999999,
  is_premium = true;

-- 添加一些示例工具数据
INSERT INTO tools (name, description, category, tool_type, html_code, css_code, js_code, is_active) VALUES
('简单计算器', '一个基础的JavaScript计算器', '实用工具', 'code', 
'<div class="calculator">
  <input type="text" id="display" readonly>
  <div class="buttons">
    <button onclick="clearDisplay()">C</button>
    <button onclick="deleteLast()">⌫</button>
    <button onclick="appendToDisplay('/')">÷</button>
    <button onclick="appendToDisplay('*')">×</button>
    <button onclick="appendToDisplay('7')">7</button>
    <button onclick="appendToDisplay('8')">8</button>
    <button onclick="appendToDisplay('9')">9</button>
    <button onclick="appendToDisplay('-')">-</button>
    <button onclick="appendToDisplay('4')">4</button>
    <button onclick="appendToDisplay('5')">5</button>
    <button onclick="appendToDisplay('6')">6</button>
    <button onclick="appendToDisplay('+')">+</button>
    <button onclick="appendToDisplay('1')">1</button>
    <button onclick="appendToDisplay('2')">2</button>
    <button onclick="appendToDisplay('3')">3</button>
    <button onclick="calculate()" rowspan="2">=</button>
    <button onclick="appendToDisplay('0')" colspan="2">0</button>
    <button onclick="appendToDisplay('.')">.</button>
  </div>
</div>',

'.calculator { max-width: 300px; margin: 20px auto; }
#display { width: 100%; height: 60px; font-size: 24px; text-align: right; padding: 0 10px; margin-bottom: 10px; }
.buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
button { height: 60px; font-size: 18px; border: 1px solid #ccc; background: #f9f9f9; cursor: pointer; }
button:hover { background: #e9e9e9; }
button:active { background: #d9d9d9; }',

'let display = document.getElementById("display");
function appendToDisplay(value) { display.value += value; }
function clearDisplay() { display.value = ""; }
function deleteLast() { display.value = display.value.slice(0, -1); }
function calculate() { 
  try { 
    display.value = eval(display.value.replace("×", "*").replace("÷", "/")); 
  } catch(e) { 
    display.value = "错误"; 
  } 
}',
true);

-- 创建索引提升查询性能
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_tools_tool_type ON tools(tool_type);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);

COMMENT ON TABLE admin_logs IS '管理员操作日志表';
COMMENT ON COLUMN users.role IS '用户角色: user, admin, super_admin';
COMMENT ON COLUMN tools.tool_type IS '工具类型: code(代码类型), external(外部链接)';
COMMENT ON COLUMN auth_codes.is_permanent IS '是否永久使用权限';