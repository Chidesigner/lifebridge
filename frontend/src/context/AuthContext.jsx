import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [hospital, setHospital] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Resolve a user's role without mutating React state inside the
  // asynchronous data-fetching function. The caller can ignore stale
  // results if a newer auth event arrives first.
  async function resolveRole(currentUser) {
    if (!currentUser) {
      return { isAdmin: false, hospital: null }
    }

    const { data: adminRow, error: adminError } = await supabase
      .from('admin_users')
      .select('admin_id')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (adminError) {
      throw adminError
    }

    if (adminRow) {
      return { isAdmin: true, hospital: null }
    }

    const { data: hospitalRow, error: hospitalError } = await supabase
      .from('hospitals')
      .select('*')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (hospitalError) {
      throw hospitalError
    }

    return { isAdmin: false, hospital: hospitalRow ?? null }
  }

  useEffect(() => {
    let isMounted = true
    let authVersion = 0

    // Keep the onAuthStateChange callback synchronous. Supabase warns
    // that awaiting Supabase client calls inside this callback can cause
    // a lock/deadlock. Defer role queries until after the callback returns.
    function applySession(currentUser) {
      const version = ++authVersion
      setUser(currentUser)

      window.setTimeout(() => {
        if (!isMounted || version !== authVersion) return

        void (async () => {
          try {
            const role = await resolveRole(currentUser)
            if (!isMounted || version !== authVersion) return

            setIsAdmin(role.isAdmin)
            setHospital(role.hospital)
          } catch (error) {
            console.error('Could not resolve the signed-in user role.', error)
            if (!isMounted || version !== authVersion) return

            setIsAdmin(false)
            setHospital(null)
          } finally {
            if (isMounted && version === authVersion) {
              setLoading(false)
            }
          }
        })()
      }, 0)
    }

    // Load persisted session outside the auth callback. Auth events can
    // also arrive here; the version counter prevents stale role lookups
    // from overwriting state for a newer login/logout event.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return

      if (error) {
        console.error('Could not restore the saved session.', error)
      }
      applySession(session?.user ?? null)
    }).catch((error) => {
      if (!isMounted) return
      console.error('Could not restore the saved session.', error)
      applySession(null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return
        applySession(session?.user ?? null)
      }
    )

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function logout() {
    const { error } = await supabase.auth.signOut()
    return error ?? null
  }

  const value = {
    loading,
    user,
    hospital,
    isAdmin,
    isVerified: hospital?.is_verified ?? false,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used inside an <AuthProvider>')
  }
  return context
}
