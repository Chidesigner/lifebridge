import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [hospital, setHospital] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  async function loadRole(currentUser) {
    if (!currentUser) {
      setIsAdmin(false)
      setHospital(null)
      return
    }

    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('admin_id')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (adminRow) {
      setIsAdmin(true)
      setHospital(null)
      return
    }

    setIsAdmin(false)

    const { data: hospitalRow } = await supabase
      .from('hospitals')
      .select('*')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    setHospital(hospitalRow ?? null)
  }

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return
      setUser(session?.user ?? null)
      await loadRole(session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return
        setUser(session?.user ?? null)
        await loadRole(session?.user ?? null)
        setLoading(false)
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
