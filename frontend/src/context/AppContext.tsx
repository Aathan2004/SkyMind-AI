import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthUser, getStoredUser, getToken, logout as clearSession, refreshSession } from '../services/authService'

type Lang = 'en' | 'ar' | 'fr' | 'de' | 'ja' | 'zh'
type Currency = 'USD' | 'EUR' | 'GBP' | 'AED' | 'JPY' | 'INR'
export type Theme = 'light' | 'dark' | 'system'

interface AppCtx {
  dark: boolean
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleDark: () => void
  lang: Lang
  setLang: (l: Lang) => void
  currency: Currency
  setCurrency: (c: Currency) => void
  user: AuthUser | null
  isAuthenticated: boolean
  isAuthLoading: boolean
  setAuthenticatedUser: (user: AuthUser) => void
  logout: () => void
}

const Ctx = createContext<AppCtx>({} as AppCtx)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system')
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const dark = theme === 'dark' || (theme === 'system' && systemDark)
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en')
  const [currency, setCurrency] = useState<Currency>(() => (localStorage.getItem('currency') as Currency) || 'USD')
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.classList.toggle('light', !dark)
  }, [dark])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', updateSystemTheme)
    return () => media.removeEventListener('change', updateSystemTheme)
  }, [])

  useEffect(() => { localStorage.setItem('lang', lang) }, [lang])
  useEffect(() => { localStorage.setItem('currency', currency) }, [currency])

  useEffect(() => {
    if (!getToken()) {
      setIsAuthLoading(false)
      return
    }
    refreshSession().then(session => {
      setUser(session?.user ?? null)
      setIsAuthLoading(false)
    })
  }, [])

  const logout = () => {
    clearSession()
    setUser(null)
  }

  return (
    <Ctx.Provider value={{ dark, theme, setTheme, toggleDark: () => setTheme(dark ? 'light' : 'dark'), lang, setLang, currency, setCurrency, user, isAuthenticated: Boolean(user && getToken()), isAuthLoading, setAuthenticatedUser: setUser, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)
