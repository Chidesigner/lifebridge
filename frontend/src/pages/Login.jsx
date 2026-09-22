import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
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
    <AuthLayout title="Log In" subtitle="Hospitals and the System Administrator use the same login.">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormField label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="you@hospital.com" />
        <FormField label="Password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

        {submitError && (
          <div className="rounded-md border border-brand-red/30 bg-red-50 px-3 py-2 text-sm text-brand-red">
            {submitError}
          </div>
        )}

        <button type="submit" disabled={submitting} className="w-full rounded-md bg-brand-navy px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-navy-dark hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none">
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-brand-navy hover:underline">Register your hospital</Link>
      </p>
    </AuthLayout>
  )
}

export default Login
