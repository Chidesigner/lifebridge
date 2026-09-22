import { useState } from 'react'
import { IdCard } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import HospitalNav from '../../components/HospitalNav'
import FormField from '../../components/FormField'
import { validateNin, validateRequiredName } from '../../lib/validators'

const BLOOD_TYPES = ['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const initialForm = {
  nin: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  bloodType: 'Unknown',
  allergies: '',
  chronicConditions: '',
  currentMedications: '',
  previousSurgeries: '',
}

function UploadRecord() {
  const { hospital } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validateAll() {
    const nextErrors = {
      nin: validateNin(form.nin),
      firstName: validateRequiredName(form.firstName, 'First name'),
      lastName: validateRequiredName(form.lastName, 'Last name'),
    }
    setErrors(nextErrors)
    return Object.values(nextErrors).every((message) => message === '')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    setSuccessMessage('')

    if (!validateAll()) return

    setSubmitting(true)

    const { error: insertError } = await supabase.from('patient_records').insert({
      hospital_id: hospital.hospital_id,
      nin: form.nin.trim(),
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      date_of_birth: form.dateOfBirth || null,
      blood_type: form.bloodType === 'Unknown' ? null : form.bloodType,
      allergies: form.allergies.trim() || null,
      chronic_conditions: form.chronicConditions.trim() || null,
      current_medications: form.currentMedications.trim() || null,
      previous_surgeries: form.previousSurgeries.trim() || null,
    })

    setSubmitting(false)

    if (insertError) {
      setSubmitError('Could not save this record. Please check your details and try again.')
      return
    }

    setSuccessMessage(`Record for ${form.firstName} ${form.lastName} was saved successfully.`)
    setForm(initialForm)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HospitalNav />

      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-xl font-semibold text-brand-navy">Upload Patient Record</h1>
        <p className="mt-1 text-sm text-gray-500">
          This record will be visible to every verified hospital that searches this patient's NIN.
        </p>

        <form className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6" onSubmit={handleSubmit} noValidate>
          <FormField
            label="NIN (National Identification Number)"
            type="text"
            icon={IdCard}
            inputMode="numeric"
            maxLength={11}
            value={form.nin}
            onChange={(e) => updateField('nin', e.target.value)}
            error={errors.nin}
            placeholder="11 digits"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField label="First name" type="text" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} error={errors.firstName} />
            <FormField label="Last name" type="text" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} error={errors.lastName} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date of birth" type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
            <FormField label="Blood type" as="select" value={form.bloodType} onChange={(e) => updateField('bloodType', e.target.value)}>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </FormField>
          </div>

          <FormField label="Known allergies" as="textarea" rows={2} value={form.allergies} onChange={(e) => updateField('allergies', e.target.value)} placeholder="e.g. Penicillin, none known" />
          <FormField label="Chronic conditions" as="textarea" rows={2} value={form.chronicConditions} onChange={(e) => updateField('chronicConditions', e.target.value)} placeholder="e.g. Hypertension, diabetes" />
          <FormField label="Current medications" as="textarea" rows={2} value={form.currentMedications} onChange={(e) => updateField('currentMedications', e.target.value)} />
          <FormField label="Previous surgeries" as="textarea" rows={2} value={form.previousSurgeries} onChange={(e) => updateField('previousSurgeries', e.target.value)} />

          {submitError && (
            <div className="rounded-md border border-brand-red/30 bg-red-50 px-3 py-2 text-sm text-brand-red">
              {submitError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-md border border-brand-green/30 bg-green-50 px-3 py-2 text-sm text-brand-green-dark">
              {successMessage}
            </div>
          )}

          <button type="submit" disabled={submitting} className="w-full rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-dark disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Saving...' : 'Save record'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default UploadRecord
