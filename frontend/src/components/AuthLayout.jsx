import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'

/**
 * Shared two-column layout for the Register and Login pages: a brand
 * panel on the left (hidden on small screens), the actual form on the
 * right. Pulled out once so both pages stay visually identical
 * without duplicating this markup.
 *
 * The form card fades and rises in once on mount — a small, cheap
 * touch of polish for a page every hospital sees on day one. This is
 * a mount transition (not scroll-triggered like Reveal), since the
 * card is already above the fold.
 */
function AuthLayout({ title, subtitle, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-brand-navy p-12 text-white md:flex">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <HeartPulse className="h-6 w-6" />
          LifeBridge
        </Link>
        <div>
          <blockquote className="font-display text-2xl font-medium leading-snug">
            "One record, every hospital, the moment it matters."
          </blockquote>
          <p className="mt-4 text-sm text-white/70">
            Cross-facility patient records for the Nsukka, Enugu case study area.
          </p>
        </div>
        <p className="text-xs text-white/50">© LifeBridge</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-gray-50 px-4 py-12 md:w-1/2">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 flex items-center gap-2 text-lg font-bold text-brand-navy md:hidden">
            <HeartPulse className="h-6 w-6" />
            LifeBridge
          </Link>
          <div
            className={
              'rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all duration-500 ease-out motion-reduce:transition-none ' +
              (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3')
            }
          >
            <h1 className="text-xl font-semibold text-brand-navy">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
