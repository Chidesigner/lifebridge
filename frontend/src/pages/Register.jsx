import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, FileBadge2, Stethoscope, Mail, Lock } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import {
  validateHospitalName,
  validateCacNumber,
  validateMdcnNumber,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../lib/validators'

const SUPPORTED_STATES = ['Enugu']

const initialForm = {
  name: '',
  cacNumber: '',
  mdcnNumber: '',
  state: SUPPORTED_STATES[0],
  contactEmail: '',
  password: '',
  confirmPassword: '',
}

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validateAll() {
    const nextErrors = {
      name: validateHospitalName(form.name),
      cacNumber: validateCacNumber(form.cacNumber),
      mdcnNumber: validateMdcnNumber(form.mdcnNumber),
      contactEmail: validateEmail(form.contactEmail),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    }
    setErrors(nextErrors)
    return Object.values(nextErrors).every((message) => message === '')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    if (!validateAll()) return

    setSubmitting(true)

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.contactEmail.trim(),
      password: form.password,
    })

    if (signUpError) {
      setSubmitting(false)
      if (signUpError.message.toLowerCase().includes('already registered')) {
        setSubmitError('An account with this email already exists. Try logging in instead.')
      } else {
        setSubmitError(signUpError.message)
      }
      return
    }

    if (!signUpData.session) {
      setSubmitting(false)
      setSubmitError(
        'Your account was created but is not yet active. Check your email ' +
        'to confirm your address, then try logging in.'
      )
      return
    }

    const { error: insertError } = await supabase.from('hospitals').insert({
      user_id: signUpData.user.id,
      name: form.name.trim(),
      cac_number: form.cacNumber.trim(),
      mdcn_number: form.mdcnNumber.trim(),
      state: form.state,
      contact_email: form.contactEmail.trim(),
    })

    setSubmitting(false)

    if (insertError) {
      if (insertError.message.includes('cac_number')) {
        setSubmitError('This CAC number is already registered to another hospital.')
      } else if (insertError.message.includes('mdcn_number')) {
        setSubmitError('This MDCN number is already registered to another hospital.')
      } else if (insertError.message.includes('contact_email')) {
        setSubmitError('This email is already registered to another hospital.')
      } else {
        setSubmitError('Could not complete registration. Please check your details and try again.')
      }
      return
    }

    navigate('/pending-verification')
  }

  return (
    <AuthLayout title="Register Your Hospital" subtitle="Currently open to hospitals in the Nsukka, Enugu case study area.">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormField label="Hospital name" type="text" icon={Building2} value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} placeholder="e.g. Bishop Shanahan Hospital" />
        <FormField label="CAC registration number" type="text" icon={FileBadge2} value={form.cacNumber} onChange={(e) => updateField('cacNumber', e.target.value)} error={errors.cacNumber} placeholder="e.g. RC-123456" />
        <FormField label="MDCN license number" type="text" icon={Stethoscope} value={form.mdcnNumber} onChange={(e) => updateField('mdcnNumber', e.target.value)} error={errors.mdcnNumber} placeholder="e.g. MDCN-98765" />
        <FormField label="State" as="select" value={form.state} onChange={(e) => updateField('state', e.target.value)}>
          {SUPPORTED_STATES.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </FormField>
        <FormField label="Contact email" type="email" icon={Mail} value={form.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} error={errors.contactEmail} placeholder="hospital@example.com" />
        <FormField label="Password" type="password" icon={Lock} value={form.password} onChange={(e) => updateField('password', e.target.value)} error={errors.password} placeholder="At least 6 characters" />
        <FormField label="Confirm password" type="password" icon={Lock} value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} error={errors.confirmPassword} />

        {submitError && (
          <div className="rounded-md border border-brand-red/30 bg-red-50 px-3 py-2 text-sm text-brand-red">
            {submitError}
          </div>
        )}

        <button type="submit" disabled={submitting} className="w-full rounded-md bg-brand-navy px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-navy-dark hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none">
          {submitting ? 'Registering...' : 'Register hospital'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-brand-navy hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  )
}

export default Register
