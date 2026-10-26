import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import Button from '../components/Button'
import { validateEmail } from '../lib/validators'

/**
 * A separate entry point from the hospital login, for two reasons:
 *
 * 1. There's no "register" link here. Admin accounts are never
 *    self-signed-up, only created manually in Supabase.
 * 2. If a HOSPITAL account is already logged in when someone lands
 *    here, we say so plainly and offer to log that session out first,
 *    instead of silently bouncing them to their own dashboard.
 */
function AdminLogin() {
  const navigate = useNavigate()
  const { user, loading, isAdmin, hospital, logout } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (loading) return
    if (isAdmin) {
      navigate('/admin/hospitals', { replace: true })
    }
  }, [loading, isAdmin, navigate])

  async function handleSwitchAccount() {
    setSigningOut(true)
    await logout()
    setSigningOut(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    const nextErrors = {
      email: validateEmail(email),
      password: password ? '' : 'Password is required.',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setSubmitting(false)

    if (error) {
      setSubmitError('Incorrect email or password.')
    }
    // On success, the useEffect above redirects once AuthContext
    // confirms the account is an admin.
  }

  const badge = (
    <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-abyss px-3.5 py-1.5 text-xs font-bold text-seafoam">
      <ShieldCheck className="h-3.5 w-3.5" />
      Administrator access
    </span>
  )

  // A different, non-admin account is already signed in.
  if (!loading && user && !isAdmin) {
    return (
      <AuthLayout
        eyebrow={badge}
        title="Switch accounts"
        subtitle={`You're signed in as ${hospital?.name ?? 'a hospital account'}. Log out to continue with an administrator login.`}
        panelTitle="Verification keeps the network trustworthy."
      >
        <Button onClick={handleSwitchAccount} loading={signingOut} size="xl" fullWidth>
          {signingOut ? 'Logging out...' : 'Log out and continue'}
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      eyebrow={badge}
      title="Administrator log in"
      subtitle="For the LifeBridge system administrator. Hospitals should use the main login."
      panelTitle="Verification keeps the network trustworthy."
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormField label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="admin@lifebridge.test" autoComplete="email" />
        <FormField label="Password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete="current-password" />

        {submitError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-coral/25 bg-coral/5 px-4 py-3 text-sm font-medium text-coral">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {submitError}
          </div>
        )}

        <Button type="submit" size="xl" fullWidth loading={submitting}>
          {submitting ? 'Logging in...' : <>Log in <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default AdminLogin
