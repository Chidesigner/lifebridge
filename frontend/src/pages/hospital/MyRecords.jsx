import { useEffect, useState } from 'react'
import { UserRound, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import HospitalNav from '../../components/HospitalNav'
import FormField from '../../components/FormField'
import Spinner from '../../components/Spinner'
import EmptyState from '../../components/EmptyState'
import { validateRequiredName } from '../../lib/validators'

const BLOOD_TYPES = ['Unknown', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// Turns a record row into the shape the edit form uses. NIN is
// deliberately left out — see the note near the Save button below.
function toEditForm(record) {
  return {
    firstName: record.first_name,
    lastName: record.last_name,
    dateOfBirth: record.date_of_birth ?? '',
    bloodType: record.blood_type ?? 'Unknown',
    allergies: record.allergies ?? '',
    chronicConditions: record.chronic_conditions ?? '',
    currentMedications: record.current_medications ?? '',
    previousSurgeries: record.previous_surgeries ?? '',
  }
}

function MyRecords() {
  const { hospital } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [editErrors, setEditErrors] = useState({})
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    setLoading(true)
    setError('')

    // Even though RLS lets any verified hospital SELECT every record,
    // "My Records" specifically means records THIS hospital uploaded —
    // so we filter to our own hospital_id here in the query itself.
    const { data, error: fetchError } = await supabase
      .from('patient_records')
      .select('*')
      .eq('hospital_id', hospital.hospital_id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Could not load your records. Please refresh the page.')
    } else {
      setRecords(data)
    }
    setLoading(false)
  }

  function startEdit(record) {
    setEditingId(record.record_id)
    setEditForm(toEditForm(record))
    setEditErrors({})
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm(null)
    setEditErrors({})
  }

  function updateEditField(field, value) {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  async function saveEdit(recordId) {
    const nextErrors = {
      firstName: validateRequiredName(editForm.firstName, 'First name'),
      lastName: validateRequiredName(editForm.lastName, 'Last name'),
    }
    setEditErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setSavingId(recordId)

    // updated_at only defaults on INSERT in our schema, not on every
    // UPDATE automatically — so we set it ourselves here to keep it
    // meaningful ("last updated" should reflect edits, not just the
    // original upload time).
    const { error: updateError } = await supabase
      .from('patient_records')
      .update({
        first_name: editForm.firstName.trim(),
        last_name: editForm.lastName.trim(),
        date_of_birth: editForm.dateOfBirth || null,
        blood_type: editForm.bloodType === 'Unknown' ? null : editForm.bloodType,
        allergies: editForm.allergies.trim() || null,
        chronic_conditions: editForm.chronicConditions.trim() || null,
        current_medications: editForm.currentMedications.trim() || null,
        previous_surgeries: editForm.previousSurgeries.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('record_id', recordId)

    setSavingId(null)

    if (updateError) {
      setError('Could not save changes. Please try again.')
      return
    }

    setRecords((prev) =>
      prev.map((r) =>
        r.record_id === recordId
          ? {
              ...r,
              first_name: editForm.firstName.trim(),
              last_name: editForm.lastName.trim(),
              date_of_birth: editForm.dateOfBirth || null,
              blood_type: editForm.bloodType === 'Unknown' ? null : editForm.bloodType,
              allergies: editForm.allergies.trim() || null,
              chronic_conditions: editForm.chronicConditions.trim() || null,
              current_medications: editForm.currentMedications.trim() || null,
              previous_surgeries: editForm.previousSurgeries.trim() || null,
              updated_at: new Date().toISOString(),
            }
          : r
      )
    )
    cancelEdit()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HospitalNav />

      <main className="p-8">
        <h1 className="text-xl font-semibold text-brand-navy">My Records</h1>
        <p className="mt-1 text-sm text-gray-500">
          Patient records your hospital has uploaded. NIN can't be changed after upload —
          if it was entered incorrectly, ask an admin about correcting it directly in the database.
        </p>

        {error && (
          <div className="mt-4 rounded-md border border-brand-red/30 bg-red-50 px-3 py-2 text-sm text-brand-red">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {loading ? (
            <Spinner label="Loading your records..." />
          ) : records.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white">
              <EmptyState icon={FileText} title="You haven't uploaded any patient records yet" description="Records you upload will show up here." />
            </div>
          ) : (
            records.map((record) => (
              <div key={record.record_id} className="rounded-lg border border-gray-200 bg-white p-5">
                {editingId === record.record_id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="First name" type="text" value={editForm.firstName} onChange={(e) => updateEditField('firstName', e.target.value)} error={editErrors.firstName} />
                      <FormField label="Last name" type="text" value={editForm.lastName} onChange={(e) => updateEditField('lastName', e.target.value)} error={editErrors.lastName} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Date of birth" type="date" value={editForm.dateOfBirth} onChange={(e) => updateEditField('dateOfBirth', e.target.value)} />
                      <FormField label="Blood type" as="select" value={editForm.bloodType} onChange={(e) => updateEditField('bloodType', e.target.value)}>
                        {BLOOD_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </FormField>
                    </div>
                    <FormField label="Known allergies" as="textarea" rows={2} value={editForm.allergies} onChange={(e) => updateEditField('allergies', e.target.value)} />
                    <FormField label="Chronic conditions" as="textarea" rows={2} value={editForm.chronicConditions} onChange={(e) => updateEditField('chronicConditions', e.target.value)} />
                    <FormField label="Current medications" as="textarea" rows={2} value={editForm.currentMedications} onChange={(e) => updateEditField('currentMedications', e.target.value)} />
                    <FormField label="Previous surgeries" as="textarea" rows={2} value={editForm.previousSurgeries} onChange={(e) => updateEditField('previousSurgeries', e.target.value)} />

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(record.record_id)}
                        disabled={savingId === record.record_id}
                        className="rounded-md bg-brand-navy px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingId === record.record_id ? 'Saving...' : 'Save changes'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={savingId === record.record_id}
                        className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                        <UserRound className="h-4.5 w-4.5 text-brand-navy" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {record.first_name} {record.last_name}
                          <span className="ml-2 font-normal text-gray-400">NIN: {record.nin}</span>
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Blood type: {record.blood_type ?? 'Not recorded'}
                          {record.date_of_birth && ` · DOB: ${record.date_of_birth}`}
                        </p>
                        {record.allergies && (
                          <p className="mt-1 text-sm text-gray-600">Allergies: {record.allergies}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => startEdit(record)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default MyRecords
