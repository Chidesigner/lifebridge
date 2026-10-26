import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search as SearchIcon, Building2, SearchX, ShieldCheck, AlertTriangle,
  Activity, Pill, Scissors, CalendarDays, Droplets, AlertCircle, FileText,
} from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import AppShell from '../../components/AppShell'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import Skeleton from '../../components/Skeleton'
import { paginate } from '../../lib/pagination'
import { validateNin } from '../../lib/validators'
import { initials, longDate, ageFrom } from '../../lib/format'

// One block of medical information inside a patient card.
function InfoBlock({ icon: Icon, label, value, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-porcelain text-lagoon',
    alert: 'bg-coral/10 text-coral',
  }
  return (
    <div className={'rounded-2xl p-4 ' + (tone === 'alert' && value ? 'bg-coral/5 ring-1 ring-coral/15' : 'bg-porcelain')}>
      <div className="flex items-center gap-2">
        <span className={'flex h-7 w-7 items-center justify-center rounded-lg ' + (value ? tones[tone] : 'bg-white text-[#9db0b5]')}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs font-bold text-slate">{label}</p>
      </div>
      <p className={'mt-2 text-sm leading-relaxed ' + (value ? 'font-semibold text-ink' : 'text-[#9db0b5]')}>
        {value || 'None recorded'}
      </p>
    </div>
  )
}

function Search() {
  const [params] = useSearchParams()
  const [nin, setNin] = useState(params.get('nin') ?? '')
  const [ninError, setNinError] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [searchedNin, setSearchedNin] = useState('')
  const [searching, setSearching] = useState(false)
  const [page, setPage] = useState(1)
  const autoRan = useRef(false)

  async function runSearch(value) {
    setError('')
    const validationError = validateNin(value)
    setNinError(validationError)
    if (validationError) return

    setSearching(true)
    setResults(null)
    setPage(1)

    const { data, error: searchError } = await supabase.rpc('search_patient_by_nin', {
      p_nin: value.trim(),
    })

    setSearching(false)

    if (searchError) {
      setError('Could not complete the search. Please try again.')
      return
    }

    setSearchedNin(value.trim())
    setResults(data)
  }

  // Arriving from the dashboard search box (/search?nin=...) runs the search once.
  useEffect(() => {
    const fromUrl = params.get('nin')
    if (fromUrl && !autoRan.current) {
      autoRan.current = true
      runSearch(fromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    runSearch(nin)
  }

  const visibleResults = results ? paginate(results, page) : []
  const hospitalCount = results ? new Set(results.map((r) => r.hospital_name)).size : 0
  const first = results?.[0]

  return (
    <AppShell title="Search by NIN" subtitle="Find a patient's records across every verified hospital.">
      <section className="surface-dark grain p-7 sm:p-10">
        <form onSubmit={handleSubmit} noValidate className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[36px] leading-[1.1] sm:text-[44px]">Who are you looking for?</h2>
          <div className="relative mt-7">
            <SearchIcon className="pointer-events-none absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-white/45" />
            <input
              value={nin}
              onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
              inputMode="numeric"
              placeholder="Enter 11-digit NIN"
              aria-label="Patient NIN"
              className="h-16 w-full rounded-full border border-white/20 bg-white/10 pl-16 pr-20 text-left text-2xl font-semibold tracking-[.16em] text-white placeholder:text-lg placeholder:font-normal placeholder:tracking-normal placeholder:text-white/40 focus:border-seafoam focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-seafoam/20"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold tabular-nums text-white/50">{nin.length}/11</span>
          </div>
          {ninError && <p className="mt-3 text-sm font-medium text-[#ffb3aa]">{ninError}</p>}
          <div className="mt-5 flex flex-col items-center gap-4">
            <Button type="submit" variant="accent" size="xl" loading={searching}>
              {searching ? 'Searching...' : 'Search all hospitals'}
            </Button>
            <p className="flex items-center gap-2 text-xs text-white/55">
              <ShieldCheck className="h-4 w-4 text-seafoam" />
              This search will be recorded in your audit log.
            </p>
          </div>
        </form>
      </section>

      {error && (
        <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-coral/25 bg-coral/5 px-5 py-4 text-sm font-medium text-coral">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {searching && (
        <div className="surface mt-6 overflow-hidden"><Skeleton rows={3} /></div>
      )}

      {results !== null && (
        <section className="mt-8">
          {results.length === 0 ? (
            <div className="surface">
              <EmptyState
                icon={SearchX}
                title={`Nothing found for ${searchedNin}`}
                description="No hospital on LifeBridge has uploaded a record for this NIN yet. The search was still logged."
              />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-[30px] leading-tight">
                    {first.first_name} {first.last_name}
                  </h2>
                  <p className="mt-1 text-sm text-slate">
                    {results.length} record{results.length > 1 ? 's' : ''} from {hospitalCount} hospital{hospitalCount > 1 ? 's' : ''} · NIN <span className="font-semibold tabular-nums text-ink">{searchedNin}</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-seafoam/30 px-4 py-2 text-xs font-bold text-deep ring-1 ring-inset ring-lagoon/20">
                  <ShieldCheck className="h-4 w-4" />
                  Search logged
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {visibleResults.map((record) => {
                  const age = ageFrom(record.date_of_birth)
                  return (
                    <article key={record.record_id} className="surface overflow-hidden" style={{ animation: 'pop-in .45s cubic-bezier(.2,.7,.2,1) both' }}>
                      <header className="flex flex-wrap items-center gap-4 border-b border-hair bg-linear-to-r from-porcelain to-white px-6 py-5">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-abyss to-lagoon text-lg font-extrabold text-seafoam">
                          {initials(record.first_name, record.last_name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-extrabold text-ink">{record.first_name} {record.last_name}</h3>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate">
                            {record.date_of_birth && (
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {longDate(record.date_of_birth)}{age !== null && ` (${age} yrs)`}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5" />
                              {record.hospital_name}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl bg-coral/10 px-4 py-2.5 text-coral">
                          <Droplets className="h-4 w-4" />
                          <span className="text-lg font-extrabold leading-none">{record.blood_type ?? '?'}</span>
                        </div>
                      </header>

                      <div className="grid gap-3 p-6 sm:grid-cols-2">
                        <InfoBlock icon={AlertTriangle} label="Allergies" value={record.allergies} tone="alert" />
                        <InfoBlock icon={Activity} label="Chronic conditions" value={record.chronic_conditions} />
                        <InfoBlock icon={Pill} label="Current medications" value={record.current_medications} />
                        <InfoBlock icon={Scissors} label="Previous surgeries" value={record.previous_surgeries} />
                        <div className="sm:col-span-2">
                          <InfoBlock icon={FileText} label="Remarks / summary" value={record.remarks} />
                        </div>
                      </div>

                      <footer className="border-t border-hair bg-porcelain/60 px-6 py-3 text-xs text-slate">
                        Uploaded by <span className="font-bold text-ink">{record.hospital_name}</span> on {longDate(record.created_at)}
                      </footer>
                    </article>
                  )
                })}
              </div>

              <div className="surface mt-5 overflow-hidden">
                <Pagination page={page} itemCount={results.length} onPageChange={setPage} />
              </div>
            </>
          )}
        </section>
      )}

      {results === null && !searching && !error && (
        <div className="surface mt-6">
          <EmptyState
            icon={SearchIcon}
            title="Ready when you are"
            description="Type a patient's NIN above. Results from every verified hospital will appear here."
          />
        </div>
      )}
    </AppShell>
  )
}

export default Search