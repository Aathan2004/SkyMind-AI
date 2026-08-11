import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, Mail, Plane, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { getErrorMessage, login, register } from '../services/authService'
import { useApp } from '../context/AppContext'
import aviationHero from '../../hero-aviation.png'

const passwordHint = 'Use 8+ characters with uppercase, lowercase, and a number.'

function validatePassword(password: string) {
  return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)
}

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { setAuthenticatedUser } = useApp()
  const isRegistering = mode === 'register'

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    const normalizedEmail = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return setError('Enter a valid work email address.')
    if (isRegistering && name.trim().length < 2) return setError('Enter your full name (at least 2 characters).')
    if (isRegistering && !validatePassword(password)) return setError(passwordHint)
    if (isRegistering && password !== confirmPassword) return setError('Passwords do not match.')

    setIsSubmitting(true)
    try {
      if (isRegistering) {
        await register({ name: name.trim(), email: normalizedEmail, password })
        setSuccess('Account created successfully. Please sign in to continue.')
        setMode('login')
        setPassword('')
        setConfirmPassword('')
      } else {
        const session = await login(normalizedEmail, password, remember)
        setAuthenticatedUser(session.user)
        navigate('/dashboard')
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldClass = 'auth-input peer'

  return (
    <main className="login-shell">
      <section className="login-hero" style={{ backgroundImage: `url(${aviationHero})` }} aria-label="SkyMind aircraft flying above the clouds">
        <div className="login-hero-overlay" />
        <div className="relative z-10 flex h-full max-w-xl flex-col justify-between p-7 sm:p-10 xl:p-14">
          <Link to="/" className="brand-lockup w-fit" aria-label="SkyMind AI home">
            <span className="brand-mark"><Plane size={21} aria-hidden="true" /></span>
            <span>SkyMind <b>AI</b></span>
          </Link>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-md">
            <span className="eyebrow"><Sparkles size={14} /> Aviation intelligence, elevated</span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">Run every journey with <span className="text-cyan-200">confidence.</span></h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-sky-100/80 sm:text-base">One precision workspace for operations, forecasting, and the people who keep the world moving.</p>
          </motion.div>
          <div className="flex items-center gap-3 text-xs text-sky-100/70"><span className="h-px w-8 bg-cyan-200/60" /> Enterprise airline operations platform</div>
        </div>
      </section>

      <section className="login-panel">
        <div className="absolute right-8 top-8 hidden text-xs text-slate-500 lg:block">Secure access · SkyMind AI</div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="login-card">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 lg:hidden"><span className="brand-mark"><Plane size={18} /></span><span className="font-bold text-slate-900 dark:text-white">SkyMind <span className="text-blue-500">AI</span></span></div>
              <p className="text-sm font-medium text-blue-600 dark:text-cyan-300">{isRegistering ? 'START YOUR JOURNEY' : 'WELCOME BACK'}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{isRegistering ? 'Create your account' : 'Sign in to SkyMind'}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-sky-300">{isRegistering ? 'Set up your secure operations workspace.' : 'Use your organization account to continue.'}</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300"><ShieldCheck size={21} /></span>
          </div>

          <AnimatePresence mode="wait">
            {error && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="auth-alert auth-alert-error">{error}</motion.div>}
            {success && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="auth-alert auth-alert-success"><CheckCircle2 size={16} /> {success}</motion.div>}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <AnimatePresence initial={false}>
              {isRegistering && <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="auth-field"><span>Full name</span><div className="relative"><UserRound className="auth-field-icon" size={17} /><input className={fieldClass} type="text" value={name} onChange={event => setName(event.target.value)} placeholder="Alex Morgan" autoComplete="name" required /></div></motion.label>}
            </AnimatePresence>
            <label className="auth-field"><span>Work email</span><div className="relative"><Mail className="auth-field-icon" size={17} /><input className={fieldClass} type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="name@company.com" autoComplete="email" required /></div></label>
            <label className="auth-field"><span>Password</span><div className="relative"><LockKeyhole className="auth-field-icon" size={17} /><input className={`${fieldClass} pr-12`} type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" autoComplete={isRegistering ? 'new-password' : 'current-password'} maxLength={72} required /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="auth-password-toggle">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{isRegistering && <small>{passwordHint}</small>}</label>
            <AnimatePresence initial={false}>
              {isRegistering && <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="auth-field"><span>Confirm password</span><div className="relative"><KeyRound className="auth-field-icon" size={17} /><input className={fieldClass} type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Repeat your password" autoComplete="new-password" maxLength={72} required /></div></motion.label>}
            </AnimatePresence>
            {!isRegistering && <div className="flex items-center justify-between pt-0.5"><label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-sky-200"><input className="auth-checkbox" type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /> Remember me</label><button type="button" onClick={() => setError('Contact your SkyMind administrator to reset your password.')} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-cyan-300">Forgot password?</button></div>}
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }} disabled={isSubmitting} className="auth-submit" type="submit">{isSubmitting ? <><span className="auth-loader" /> Securing your session…</> : <>{isRegistering ? 'Create secure account' : 'Sign in securely'} <ArrowRight size={17} /></>}</motion.button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500 dark:text-sky-300">{isRegistering ? 'Already have an account?' : 'New to SkyMind?'} <button type="button" className="font-semibold text-blue-600 hover:underline dark:text-cyan-300" onClick={() => switchMode(isRegistering ? 'login' : 'register')}>{isRegistering ? 'Sign in' : 'Create an account'}</button></p>
          <p className="mt-7 text-center text-xs text-slate-400 dark:text-sky-500">Protected with enterprise-grade authentication.</p>
        </motion.div>
      </section>
    </main>
  )
}
