import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './lib/store'
import { PrivateRoute } from './components/PrivateRoute'

// Pages
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Tools } from './pages/Tools'
import { ToolDetail } from './pages/ToolDetail'
import { Profile } from './pages/Profile'
import { Redeem } from './pages/Redeem'
import { UsageHistory } from './pages/UsageHistory'
import { AIAssistantLocal as AIAssistant } from './pages/AIAssistantLocal'
import { NotFound } from './pages/NotFound'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Help } from './pages/Help'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminTools } from './pages/admin/AdminTools'
import { AdminToolForm } from './pages/admin/AdminToolForm'
import { AdminCodes } from './pages/admin/AdminCodes'
import { AdminAIModels } from './pages/admin/AdminAIModels'
import { AIModelDebug } from './pages/AIModelDebug'
import { DebugAPIKeys } from './pages/DebugAPIKeys'

function App() {
  const { loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <PrivateRoute requireAuth={false}>
            <Login />
          </PrivateRoute>
        } />
        <Route path="/register" element={
          <PrivateRoute requireAuth={false}>
            <Register />
          </PrivateRoute>
        } />
        
        {/* Tools Routes */}
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/:id" element={<ToolDetail />} />
        
        {/* User Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/usage-history" element={<UsageHistory />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        
        {/* Info Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute requiredRoles={['admin', 'super_admin']}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute requiredRoles={['admin', 'super_admin']}>
            <AdminUsers />
          </PrivateRoute>
        } />
        <Route path="/admin/tools" element={
          <PrivateRoute requiredRoles={['admin', 'super_admin']}>
            <AdminTools />
          </PrivateRoute>
        } />
        <Route path="/admin/tools/new" element={
          <PrivateRoute requiredRoles={['admin', 'super_admin']}>
            <AdminToolForm />
          </PrivateRoute>
        } />
        <Route path="/admin/tools/:id/edit" element={
          <PrivateRoute requiredRoles={['admin', 'super_admin']}>
            <AdminToolForm />
          </PrivateRoute>
        } />
        <Route path="/admin/codes" element={
          <PrivateRoute requiredRoles={['admin', 'super_admin']}>
            <AdminCodes />
          </PrivateRoute>
        } />
        <Route path="/admin/ai-models" element={
          <PrivateRoute requiredRoles={['admin', 'super_admin']}>
            <AdminAIModels />
          </PrivateRoute>
        } />
        <Route path="/debug/ai-models" element={
          <PrivateRoute requiredRoles={['admin', 'super_admin']}>
            <AIModelDebug />
          </PrivateRoute>
        } />
        <Route path="/debug/api-keys" element={
          <PrivateRoute requiredRoles={['admin', 'super_admin']}>
            <DebugAPIKeys />
          </PrivateRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
