// Debug script for testing tool creation
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testToolCreation() {
  console.log('Testing tool creation...')
  
  const toolData = {
    name: 'JSON格式化工具',
    description: '专业的JSON数据格式化、验证和压缩工具。支持语法高亮、错误定位、数据统计和示例数据。',
    category: '文本处理',
    required_role: 'user',
    is_active: true,
    html_code: '<div class="test">HTML Code Test</div>',
    css_code: '.test { color: blue; }',
    js_code: 'console.log("JS Code Test");'
  }

  try {
    const { data, error } = await supabase
      .from('tools')
      .insert([toolData])
      .select()

    if (error) {
      console.error('Error creating tool:', error)
    } else {
      console.log('Tool created successfully:', data)
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testToolCreation()