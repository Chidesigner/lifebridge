import { useState } from 'react'
import { Search as SearchIcon, UserRound, Building2, SearchX } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import HospitalNav from '../../components/HospitalNav'
import FormField from '../../components/FormField'
import EmptyState from '../../components/EmptyState'
import { validateNin } from '../../lib/validators'

function Search() {
  const [nin, setNin] = useState('')
  const [ninError, setNinError] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [searchedNin, setSearchedNin] = useState('')
  const [searching, setSearching] = useState(false)

  async function handleSearch(event) {
    event.preventDefault()
    setError('')

    const validationError = validateNin(nin)
    setNinError(validationError)
    if (validationError) return

    setSearching(true)
    setResults(null)

    // One function call performs the lookup AND writes the audit log
    // entry atomically, inside the database — see search_patient_by_nin
    // in supabase/rls.sql. There is no separate logging step here.
    const { data, error: searchError } = await supabase.rpc('search_patient_by_nin', {
      p_nin: nin.trim(),
    })

    setSearching(false)

    if (searchError) {
      setError('Could not complete the search. Please try again.')
      return
    }

    setSearchedNin(nin.trim())
    setResults(data)
  }

  return (
    <div className="app-shell min-h-screen">
      <HospitalNav />

      <main className="page-content mx-auto max-w-2xl p-8">
        <h1 className="text-xl font-semibold text-brand-navy">Search by NIN</h1>
        <p className="mt-1 text-sm text-gray-500">
          Searches every hospital on LifeBridge for this patient. Every search is recorded in the audit log.
        </p>

        <form onSubmit={handleSearch} className="mt-6 flex items-start gap-3" noValidate>
          <div className="flex-1">
            <FormField
              label="Patient NIN"
              type="text"
              icon={SearchIcon}
              inputMode="numeric"
              maxLength={11}
              value={nin}
              onChange={(e) => setNin(e.target.value)}
              error={ninError}
              placeholder="11 digits"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="mt-6 rounded-md bg-brand-navy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-md border border-brand-red/30 bg-red-50 px-3 py-2 text-sm text-brand-red">
            {error}
          </div>
        )}

        {results !== null && (
          <div className="mt-6">
            {results.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white">
                <EmptyState icon={SearchX} title={`No records found for NIN ${searchedNin}`} description="No hospital on LifeBridge has uploaded a record for this NIN." />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {results.length} record{results.length > 1 ? 's' : ''} found for NIN {searchedNin}.
                </p>
                {results.map((record) => (
                  <div key={record.record_id} className="rounded-lg border border-gray-200 bg-white p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                          <UserRound className="h-4.5 w-4.5 text-brand-navy" />
                        </div>
                        <p className="font-medium text-gray-900">
                          {record.first_name} {record.last_name}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-brand-navy">
                        <Building2 className="h-3.5 w-3.5" />
                        {record.hospital_name}
                      </span>
                    </div>
                    <div className="mt-3 pl-12 text-sm text-gray-600">
                      <p>
                        Blood type: {record.blood_type ?? 'Not recorded'}
                        {record.date_of_birth && ` · DOB: ${record.date_of_birth}`}
                      </p>
                      {record.allergies && <p className="mt-1">Allergies: {record.allergies}</p>}
                      {record.chronic_conditions && <p className="mt-1">Chronic conditions: {record.chronic_conditions}</p>}
                      {record.current_medications && <p className="mt-1">Current medications: {record.current_medications}</p>}
                      {record.previous_surgeries && <p className="mt-1">Previous surgeries: {record.previous_surgeries}</p>}
                      <p className="mt-2 text-xs text-gray-400">
                        Uploaded {new Date(record.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Search
