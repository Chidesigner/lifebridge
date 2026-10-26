import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/Button'

function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-abyss px-5 text-center text-white grain">
      <div className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-lagoon/50 blur-3xl" />
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="absolute left-6 top-6 sm:left-10 sm:top-8"><Logo light /></div>

      <p className="relative font-display text-[9rem] leading-none text-gold sm:text-[13rem]">404</p>
      <h1 className="relative mt-2 font-display text-4xl sm:text-5xl">This bridge leads nowhere.</h1>
      <p className="relative mt-4 max-w-md text-white/65">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="relative mt-9">
        <Button variant="accent" size="lg"><ArrowLeft className="h-4 w-4" />Back to LifeBridge</Button>
      </Link>
    </div>
  )
}
export default NotFound
