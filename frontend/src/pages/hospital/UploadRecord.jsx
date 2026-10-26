import { useState } from 'react'
import { IdCard, Lock, Eye, ClipboardCheck, UserRound, AlertCircle, Droplets } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import AppShell from '../../components/AppShell'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import BloodTypePicker from '../../components/BloodTypePicker'
import { useToast } from '../../components/ToastProvider'
import { validateNin, validateRequiredName } from '../../lib/validators'
import { initials } from '../../lib/format'

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
  remarks: '',
}

const TIPS = [
  { icon: Eye, title: 'Shared with verified hospitals', text: 'Any verified hospital that searches this NIN will see the record and your hospital\'s name.' },
  { icon: Lock, title: 'The NIN is permanent', text: 'It cannot be edited after upload. Check all 11 digits before you save.' },
  { icon: ClipboardCheck, title: 'Accuracy matters', text: 'Allergies and conditions are what another doctor reads first.' },
]

function UploadRecord() {
  const { hospital } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
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
      remarks: form.remarks.trim() || null,
    })

    setSubmitting(false)

    if (insertError) {
      setSubmitError('Could not save this record. Please check your details and try again.')
      return
    }

    toast.show(`Record for ${form.firstName} ${form.lastName} was saved.`)
    setForm(initialForm)
  }

  const fullName = `${form.firstName} ${form.lastName}`.trim()

  return (
    <AppShell title="Upload a patient record" subtitle="Add what you know. Other verified hospitals will be able to find it by NIN.">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form className="surface space-y-9 p-6 sm:p-9" onSubmit={handleSubmit} noValidate>
          <section>
            <h2 className="font-display text-[28px]">Patient</h2>
            <div className="mt-5 space-y-4">
              <FormField
                label="NIN (National Identification Number)"
                type="text"
                icon={IdCard}
                inputMode="numeric"
                maxLength={11}
                value={form.nin}
                onChange={(e) => updateField('nin', e.target.value.replace(/\D/g, ''))}
                error={errors.nin}
                placeholder="11 digits"
                hint={`${form.nin.length}/11 digits`}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="First name" type="text" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} error={errors.firstName} />
                <FormField label="Last name" type="text" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} error={errors.lastName} />
              </div>
              <FormField label="Date of birth" type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
              <BloodTypePicker value={form.bloodType} onChange={(value) => updateField('bloodType', value)} />
            </div>
          </section>

          <section>
            <h2 className="font-display text-[28px]">Medical history</h2>
            <div className="mt-5 space-y-4">
              <FormField label="Known allergies" as="textarea" rows={2} maxLength={2000} value={form.allergies} onChange={(e) => updateField('allergies', e.target.value)} placeholder="e.g. Penicillin. Leave blank if none known." />
              <FormField label="Chronic conditions" as="textarea" rows={2} maxLength={2000} value={form.chronicConditions} onChange={(e) => updateField('chronicConditions', e.target.value)} placeholder="e.g. Hypertension, type 2 diabetes" />
              <FormField label="Current medications" as="textarea" rows={2} maxLength={2000} value={form.currentMedications} onChange={(e) => updateField('currentMedications', e.target.value)} />
              <FormField label="Previous surgeries" as="textarea" rows={2} maxLength={2000} value={form.previousSurgeries} onChange={(e) => updateField('previousSurgeries', e.target.value)} />
              <FormField label="Remarks / summary" as="textarea" rows={3} maxLength={2000} value={form.remarks} onChange={(e) => updateField('remarks', e.target.value)} placeholder="Anything else the next hospital should know about this patient." hint={`${form.remarks.length}/2000`} />
            </div>
          </section>

          {submitError && (
            <div className="flex items-center gap-2.5 rounded-xl border border-coral/25 bg-coral/5 px-4 py-3 text-sm font-medium text-coral">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {submitError}
            </div>
          )}

          <Button type="submit" size="xl" fullWidth loading={submitting}>{submitting ? 'Saving...' : 'Save record'}</Button>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
          <div className="surface-dark grain p-6">
            <p className="text-xs font-bold text-white/55">Live preview</p>
            <div className="relative mt-4 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-seafoam to-lagoon text-lg font-extrabold text-abyss">
                {fullName ? initials(form.firstName, form.lastName) : <UserRound className="h-6 w-6" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold">{fullName || 'Patient name'}</p>
                <p className="text-xs tabular-nums text-white/55">NIN {form.nin || '00000000000'}</p>
              </div>
            </div>
            <div className="relative mt-5 flex items-center gap-2 text-sm text-white/75">
              <Droplets className="h-4 w-4 text-[#ff9a8f]" />
              Blood type {form.bloodType === 'Unknown' ? 'not set' : form.bloodType}
            </div>
          </div>

          <div className="surface space-y-5 p-6">
            {TIPS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-seafoam/30 text-deep">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  )
}

export default UploadRecord