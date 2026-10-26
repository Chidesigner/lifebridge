import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Search as SearchIcon, Pencil, Droplets, AlertTriangle, AlertCircle, UploadCloud } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import AppShell from '../../components/AppShell'
import FormField from '../../components/FormField'
import Skeleton from '../../components/Skeleton'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import BloodTypePicker from '../../components/BloodTypePicker'
import { useToast } from '../../components/ToastProvider'
import { paginate } from '../../lib/pagination'
import { validateRequiredName } from '../../lib/validators'
import { initials, timeAgo } from '../../lib/format'

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
    remarks: record.remarks ?? '',
  }
}

function MyRecords() {
  const { hospital } = useAuth()
  const toast = useToast()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [filterText, setFilterText] = useState('')

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

    const changes = {
      first_name: editForm.firstName.trim(),
      last_name: editForm.lastName.trim(),
      date_of_birth: editForm.dateOfBirth || null,
      blood_type: editForm.bloodType === 'Unknown' ? null : editForm.bloodType,
      allergies: editForm.allergies.trim() || null,
      chronic_conditions: editForm.chronicConditions.trim() || null,
      current_medications: editForm.currentMedications.trim() || null,
      previous_surgeries: editForm.previousSurgeries.trim() || null,
      remarks: editForm.remarks.trim() || null,
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase.from('patient_records').update(changes).eq('record_id', recordId)

    setSavingId(null)

    if (updateError) {
      toast.show('Could not save changes. Please try again.', { type: 'error' })
      return
    }

    setRecords((prev) => prev.map((r) => (r.record_id === recordId ? { ...r, ...changes } : r)))
    cancelEdit()
    toast.show('Changes saved.')
  }

  const filtered = useMemo(() => {
    const query = filterText.trim().toLowerCase()
    if (!query) return records
    return records.filter(
      (r) => r.nin.includes(query) || `${r.first_name} ${r.last_name}`.toLowerCase().includes(query)
    )
  }, [records, filterText])

  function handleFilterChange(value) {
    setFilterText(value)
    setPage(1)
  }

  const visibleRecords = paginate(filtered, page)

  return (
    <AppShell
      title="My records"
      subtitle="Everything your hospital has uploaded. A NIN can't be changed after upload."
      actions={<Link to="/records/upload"><Button><UploadCloud className="h-4 w-4" /><span className="hidden sm:inline">Upload record</span></Button></Link>}
    >
      {!loading && records.length > 0 && (
        <div className="relative max-w-md">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#8aa0a6]" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => handleFilterChange(e.target.value)}
            placeholder="Filter by name or NIN"
            className="h-12 w-full rounded-full border border-hair bg-white pl-11 pr-4 text-sm shadow-[0_1px_2px_rgba(6,28,34,.04)] placeholder:text-[#9db0b5] focus:border-lagoon focus:outline-none focus:ring-4 focus:ring-lagoon/15"
          />
        </div>
      )}

      {error && (
        <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-coral/25 bg-coral/5 px-5 py-4 text-sm font-medium text-coral">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="surface overflow-hidden"><Skeleton rows={4} /></div>
        ) : records.length === 0 ? (
          <div className="surface">
            <EmptyState
              icon={FileText}
              title="You haven't uploaded any records"
              description="Records you add will show up here, and become searchable by other verified hospitals."
              action={<Link to="/records/upload"><Button><UploadCloud className="h-4 w-4" />Upload your first record</Button></Link>}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="surface"><EmptyState icon={SearchIcon} title="No matching records" description="Try a different name or NIN." /></div>
        ) : (
          <>
            <div className="space-y-4">
              {visibleRecords.map((record) => (
                <article key={record.record_id} className="surface p-5 sm:p-6">
                  {editingId === record.record_id ? (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h2 className="font-display text-[26px]">Edit record</h2>
                        <span className="rounded-full bg-porcelain px-3 py-1 text-xs font-semibold tabular-nums text-slate">NIN {record.nin}</span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="First name" type="text" value={editForm.firstName} onChange={(e) => updateEditField('firstName', e.target.value)} error={editErrors.firstName} />
                        <FormField label="Last name" type="text" value={editForm.lastName} onChange={(e) => updateEditField('lastName', e.target.value)} error={editErrors.lastName} />
                      </div>
                      <FormField label="Date of birth" type="date" value={editForm.dateOfBirth} onChange={(e) => updateEditField('dateOfBirth', e.target.value)} />
                      <BloodTypePicker value={editForm.bloodType} onChange={(v) => updateEditField('bloodType', v)} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Known allergies" as="textarea" rows={2} maxLength={2000} value={editForm.allergies} onChange={(e) => updateEditField('allergies', e.target.value)} />
                        <FormField label="Chronic conditions" as="textarea" rows={2} maxLength={2000} value={editForm.chronicConditions} onChange={(e) => updateEditField('chronicConditions', e.target.value)} />
                        <FormField label="Current medications" as="textarea" rows={2} maxLength={2000} value={editForm.currentMedications} onChange={(e) => updateEditField('currentMedications', e.target.value)} />
                        <FormField label="Previous surgeries" as="textarea" rows={2} maxLength={2000} value={editForm.previousSurgeries} onChange={(e) => updateEditField('previousSurgeries', e.target.value)} />
                      </div>
                      <FormField label="Remarks / summary" as="textarea" rows={3} maxLength={2000} value={editForm.remarks} onChange={(e) => updateEditField('remarks', e.target.value)} />
                      <div className="flex gap-2">
                        <Button onClick={() => saveEdit(record.record_id)} loading={savingId === record.record_id}>
                          {savingId === record.record_id ? 'Saving...' : 'Save changes'}
                        </Button>
                        <Button variant="secondary" onClick={cancelEdit} disabled={savingId === record.record_id}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-seafoam/70 to-seafoam/20 text-lg font-extrabold text-deep">
                        {initials(record.first_name, record.last_name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-extrabold text-ink">{record.first_name} {record.last_name}</h2>
                        <p className="mt-0.5 text-xs tabular-nums text-slate">NIN {record.nin} · Uploaded {timeAgo(record.created_at)}</p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/10 px-3 py-1 text-xs font-bold text-coral">
                            <Droplets className="h-3.5 w-3.5" />{record.blood_type ?? 'Blood type unknown'}
                          </span>
                          {record.allergies && (
                            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-champagne/20 px-3 py-1 text-xs font-semibold text-champagne-deep">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" /><span className="truncate">Allergy: {record.allergies}</span>
                            </span>
                          )}
                        </div>
                        {record.remarks && (
                          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate">Remarks: {record.remarks}</p>
                        )}
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => startEdit(record)}><Pencil className="h-3.5 w-3.5" />Edit</Button>
                    </div>
                  )}
                </article>
              ))}
            </div>
            <div className="surface mt-5 overflow-hidden">
              <Pagination page={page} itemCount={filtered.length} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}

export default MyRecords