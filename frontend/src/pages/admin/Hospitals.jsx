import { useEffect, useMemo, useState } from 'react'
import { Building2, FileText, AlertCircle, Mail, Hash, BadgeCheck, Clock, ExternalLink, ShieldOff, Check } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import AppShell from '../../components/AppShell'
import Skeleton from '../../components/Skeleton'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../components/ToastProvider'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import Pagination from '../../components/Pagination'
import { paginate } from '../../lib/pagination'
import { nameInitials, timeAgo } from '../../lib/format'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Awaiting review' },
  { id: 'verified', label: 'Verified' },
]

function Hospitals() {
  const toast = useToast()
  const [revokeTarget, setRevokeTarget] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('all')

  async function loadHospitals() {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('hospitals')
      .select('*')
      .order('created_at', { ascending: false })
    if (fetchError) {
      setError('Could not load hospitals. Please refresh the page.')
    } else {
      setHospitals(data)
    }
    setLoading(false)
  }

  useEffect(() => { loadHospitals() }, [])

  // Documents are private. We ask Supabase for a link that works for 60 seconds.
  async function openDocument(path) {
    if (!path) return
    const tab = window.open('', '_blank') // open now so the browser doesn't block it
    const { data, error: urlError } = await supabase.storage
      .from('hospital-documents')
      .createSignedUrl(path, 60)
    if (urlError) {
      tab?.close()
      toast.show('Could not open this document.', { type: 'error' })
      return
    }
    tab.location.href = data.signedUrl
  }

  async function setVerified(hospitalId, verified) {
    setUpdatingId(hospitalId)
    const { error: updateError } = await supabase
      .from('hospitals')
      .update({ is_verified: verified })
      .eq('hospital_id', hospitalId)
    if (updateError) {
      toast.show('Could not update this hospital. Please try again.', { type: 'error' })
    } else {
      toast.show(verified ? 'Hospital approved.' : 'Access revoked.')
      setHospitals((prev) => prev.map((h) => (h.hospital_id === hospitalId ? { ...h, is_verified: verified } : h)))
    }
    setUpdatingId(null)
    setRevokeTarget(null)
  }

  const pendingCount = hospitals.filter((h) => !h.is_verified).length
  const verifiedCount = hospitals.length - pendingCount

  const filtered = useMemo(() => {
    if (filter === 'pending') return hospitals.filter((h) => !h.is_verified)
    if (filter === 'verified') return hospitals.filter((h) => h.is_verified)
    return hospitals
  }, [hospitals, filter])

  function changeFilter(next) {
    setFilter(next)
    setPage(1)
  }

  const visibleHospitals = paginate(filtered, page)

  const stats = [
    { label: 'Registered', value: hospitals.length, icon: Building2, tone: 'bg-seafoam/30 text-deep' },
    { label: 'Awaiting review', value: pendingCount, icon: Clock, tone: 'bg-champagne/25 text-champagne-deep' },
    { label: 'Verified', value: verifiedCount, icon: BadgeCheck, tone: 'bg-lagoon/15 text-lagoon' },
  ]

  return (
    <AppShell title="Hospitals" subtitle="Check each hospital's documents, then approve it. Revoke access at any time.">
      <section className="grid gap-5 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="surface flex items-center gap-4 p-5">
            <span className={'flex h-12 w-12 items-center justify-center rounded-2xl ' + tone}><Icon className="h-5 w-5" /></span>
            <div>
              <p className="font-display text-[40px] leading-none text-ink">{loading ? '–' : value}</p>
              <p className="mt-1 text-xs font-semibold text-slate">{label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => changeFilter(f.id)}
            className={'rounded-full px-5 py-2.5 text-sm font-bold transition-all ' + (filter === f.id ? 'bg-abyss text-white shadow-lg shadow-abyss/20' : 'bg-white text-slate ring-1 ring-inset ring-hair hover:text-ink')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-coral/25 bg-coral/5 px-5 py-4 text-sm font-medium text-coral">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="surface overflow-hidden"><Skeleton rows={4} /></div>
        ) : filtered.length === 0 ? (
          <div className="surface">
            <EmptyState
              icon={Building2}
              title={hospitals.length === 0 ? 'No hospitals have registered yet' : 'Nothing in this view'}
              description={hospitals.length === 0 ? 'New registrations will appear here for review.' : 'Try another filter.'}
            />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {visibleHospitals.map((hospital) => (
                <article key={hospital.hospital_id} className="surface p-5 sm:p-6">
                  <div className="flex flex-wrap items-start gap-5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-abyss to-lagoon text-lg font-extrabold text-seafoam">
                      {nameInitials(hospital.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-extrabold text-ink">{hospital.name}</h2>
                        <StatusBadge verified={hospital.is_verified} />
                      </div>
                      <p className="mt-1 text-xs text-slate">Registered {timeAgo(hospital.created_at)}{hospital.state ? ` · ${hospital.state}` : ''}</p>

                      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-porcelain px-4 py-3">
                          <dt className="flex items-center gap-1.5 text-[11px] font-bold text-slate"><Hash className="h-3 w-3" />CAC number</dt>
                          <dd className="mt-1 break-all text-sm font-bold text-ink">{hospital.cac_number}</dd>
                        </div>
                        <div className="rounded-xl bg-porcelain px-4 py-3">
                          <dt className="flex items-center gap-1.5 text-[11px] font-bold text-slate"><Hash className="h-3 w-3" />MDCN number</dt>
                          <dd className="mt-1 break-all text-sm font-bold text-ink">{hospital.mdcn_number}</dd>
                        </div>
                        <div className="rounded-xl bg-porcelain px-4 py-3">
                          <dt className="flex items-center gap-1.5 text-[11px] font-bold text-slate"><Mail className="h-3 w-3" />Contact</dt>
                          <dd className="mt-1 break-all text-sm font-bold text-ink">{hospital.contact_email}</dd>
                        </div>
                      </dl>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {hospital.cac_document_path ? (
                          <>
                            <button onClick={() => openDocument(hospital.cac_document_path)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink ring-1 ring-inset ring-hair transition-all hover:-translate-y-0.5 hover:ring-lagoon">
                              <FileText className="h-3.5 w-3.5 text-lagoon" />CAC certificate<ExternalLink className="h-3 w-3 text-slate" />
                            </button>
                            <button onClick={() => openDocument(hospital.license_document_path)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink ring-1 ring-inset ring-hair transition-all hover:-translate-y-0.5 hover:ring-lagoon">
                              <FileText className="h-3.5 w-3.5 text-lagoon" />Facility licence<ExternalLink className="h-3 w-3 text-slate" />
                            </button>
                          </>
                        ) : (
                          <span className="rounded-full bg-champagne/20 px-4 py-2 text-xs font-bold text-champagne-deep">No documents uploaded</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-auto">
                      {hospital.is_verified ? (
                        <Button variant="secondary" fullWidth className="!text-coral" onClick={() => setRevokeTarget(hospital)}>
                          <ShieldOff className="h-4 w-4" />Revoke
                        </Button>
                      ) : (
                        <Button variant="success" fullWidth loading={updatingId === hospital.hospital_id} onClick={() => setVerified(hospital.hospital_id, true)}>
                          <Check className="h-4 w-4" />Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="surface mt-5 overflow-hidden">
              <Pagination page={page} itemCount={filtered.length} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={revokeTarget !== null}
        title="Revoke access?"
        description={revokeTarget ? `${revokeTarget.name} will immediately lose access to LifeBridge. You can approve it again later.` : ''}
        confirmLabel="Revoke access"
        loading={revokeTarget !== null && updatingId === revokeTarget.hospital_id}
        onCancel={() => setRevokeTarget(null)}
        onConfirm={() => setVerified(revokeTarget.hospital_id, false)}
      />
    </AppShell>
  )
}
export default Hospitals
