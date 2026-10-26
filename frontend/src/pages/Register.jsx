import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, FileBadge2, Stethoscope, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import Button from '../components/Button'
import FileField from '../components/FileField'
import {
  validateHospitalName,
  validateCacNumber,
  validateMdcnNumber,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateDocument,
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

function fileExtension(file) {
  return file.name.split('.').pop().toLowerCase()
}

function StepTitle({ number, children }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-abyss text-xs font-bold text-white">{number}</span>
      <h2 className="text-sm font-bold text-ink">{children}</h2>
      <span className="h-px flex-1 bg-hair" />
    </div>
  )
}

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [cacFile, setCacFile] = useState(null)
  const [licenseFile, setLicenseFile] = useState(null)
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
      cacFile: validateDocument(cacFile, 'CAC certificate'),
      licenseFile: validateDocument(licenseFile, 'Facility licence'),
    }
    setErrors(nextErrors)
    return Object.values(nextErrors).every((message) => message === '')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    if (!validateAll()) return

    setSubmitting(true)

    const email = form.contactEmail.trim()
    let { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: form.password,
    })

    // If an earlier attempt created the login but failed before finishing
    // (e.g. a bad connection during upload), let the same person continue.
    if (signUpError && signUpError.message.toLowerCase().includes('already registered')) {
      const retry = await supabase.auth.signInWithPassword({ email, password: form.password })
      if (!retry.error) {
        signUpData = retry.data
        signUpError = null
      }
    }

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

    // Upload both documents into a private folder named after the user's id.
    const userId = signUpData.user.id
    const cacPath = `${userId}/cac-certificate.${fileExtension(cacFile)}`
    const licensePath = `${userId}/facility-licence.${fileExtension(licenseFile)}`

    const [cacUpload, licenseUpload] = await Promise.all([
      supabase.storage.from('hospital-documents').upload(cacPath, cacFile, { upsert: false }),
      supabase.storage.from('hospital-documents').upload(licensePath, licenseFile, { upsert: false }),
    ])

    // A retry after a half-finished registration finds the files already there.
    // That is fine: they belong to this user and cannot be overwritten.
    const alreadyThere = (e) =>
      e && (e.statusCode === '409' || e.statusCode === 409 || /already exists|duplicate/i.test(e.message || ''))
    const cacFailed = cacUpload.error && !alreadyThere(cacUpload.error)
    const licenseFailed = licenseUpload.error && !alreadyThere(licenseUpload.error)

    if (cacFailed || licenseFailed) {
      setSubmitting(false)
      setSubmitError('Could not upload your documents. Please check your connection and try again.')
      return
    }

    const { error: insertError } = await supabase.from('hospitals').insert({
      user_id: userId,
      cac_document_path: cacPath,
      license_document_path: licensePath,
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
    <AuthLayout
      title="Register your hospital"
      subtitle="Open to hospitals in the Nsukka, Enugu case study area. An administrator reviews every application before access is granted."
      panelTitle="Join the network that follows the patient."
    >
      <form className="space-y-9" onSubmit={handleSubmit} noValidate>
        <section>
          <StepTitle number="1">Your hospital</StepTitle>
          <div className="space-y-4">
            <FormField label="Hospital name" type="text" icon={Building2} value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} placeholder="e.g. Greenfield Hospital" />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="CAC registration number" type="text" icon={FileBadge2} value={form.cacNumber} onChange={(e) => updateField('cacNumber', e.target.value)} error={errors.cacNumber} placeholder="e.g. RC-123456" />
              <FormField label="MDCN number" type="text" icon={Stethoscope} value={form.mdcnNumber} onChange={(e) => updateField('mdcnNumber', e.target.value)} error={errors.mdcnNumber} placeholder="e.g. MDCN-98765" />
            </div>
            <FormField label="State" as="select" value={form.state} onChange={(e) => updateField('state', e.target.value)}>
              {SUPPORTED_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </FormField>
          </div>
        </section>

        <section>
          <StepTitle number="2">Verification documents</StepTitle>
          <div className="space-y-4">
            <FileField label="CAC certificate" hint="PDF, JPG or PNG, up to 5 MB" file={cacFile} onChange={setCacFile} error={errors.cacFile} />
            <FileField label="Health facility licence" hint="PDF, JPG or PNG, up to 5 MB" file={licenseFile} onChange={setLicenseFile} error={errors.licenseFile} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate">Documents are stored privately. Only you and the LifeBridge administrator can open them.</p>
        </section>

        <section>
          <StepTitle number="3">Your login</StepTitle>
          <div className="space-y-4">
            <FormField label="Contact email" type="email" icon={Mail} value={form.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} error={errors.contactEmail} placeholder="hospital@example.com" autoComplete="email" />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Password" type="password" icon={Lock} value={form.password} onChange={(e) => updateField('password', e.target.value)} error={errors.password} placeholder="At least 6 characters" autoComplete="new-password" />
              <FormField label="Confirm password" type="password" icon={Lock} value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} error={errors.confirmPassword} autoComplete="new-password" />
            </div>
          </div>
        </section>

        {submitError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-coral/25 bg-coral/5 px-4 py-3 text-sm font-medium text-coral">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {submitError}
          </div>
        )}

        <Button type="submit" size="xl" fullWidth loading={submitting}>
          {submitting ? 'Submitting application...' : <>Submit application <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate">
        Already registered?{' '}
        <Link to="/login" className="font-bold text-lagoon hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  )
}

export default Register