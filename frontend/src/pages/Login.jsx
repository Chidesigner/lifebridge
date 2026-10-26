import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import Button from '../components/Button'
import { validateEmail } from '../lib/validators'

function Login() {
  const navigate = useNavigate()
  const { user, loading, isAdmin, hospital, isVerified } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loading || !user) return

    if (isAdmin) {
      navigate('/admin/hospitals', { replace: true })
    } else if (hospital) {
      navigate(isVerified ? '/dashboard' : '/pending-verification', { replace: true })
    }
  }, [loading, user, isAdmin, hospital, isVerified, navigate])

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
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your hospital's LifeBridge account.">
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormField label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="you@hospital.com" autoComplete="email" />
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

      <p className="mt-8 text-center text-sm text-slate">
        New to LifeBridge?{' '}
        <Link to="/register" className="font-bold text-lagoon hover:underline">Register your hospital</Link>
      </p>
      <p className="mt-3 text-center text-xs text-slate/80">
        System administrator?{' '}
        <Link to="/admin/login" className="font-semibold text-ink hover:underline">Use the admin login</Link>
      </p>
    </AuthLayout>
  )
}

export default Login
