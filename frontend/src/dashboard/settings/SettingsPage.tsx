import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Moon, Sun, Monitor, Globe, DollarSign, Bell, Shield, User, CheckCircle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import { useApp } from '../../context/AppContext'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
]

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', label: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', label: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
]

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${value ? 'bg-accent' : 'bg-white/10'}`}>
      <motion.div animate={{ x: value ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow" />
    </button>
  )
}

export default function SettingsPage() {
  const { dark, theme, setTheme, lang, setLang, currency, setCurrency } = useApp()
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, delays: true, offers: false })
  const [privacy, setPrivacy] = useState({ analytics: true, marketing: false, thirdParty: false })

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" subtitle="Preferences, appearance, and account settings" icon={Settings}>
        <button onClick={handleSave} className="btn-primary text-xs flex items-center gap-1.5">
          {saved ? <><CheckCircle size={13} /> Saved!</> : 'Save Changes'}
        </button>
      </PageHeader>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <p className="text-white font-semibold mb-4 flex items-center gap-2">
            {dark ? <Moon size={15} className="text-accent" /> : <Sun size={15} className="text-amber-400" />} Appearance
          </p>
          <div className="flex items-center justify-between p-4 glass rounded-xl mb-3">
            <div className="flex items-center gap-3">
              {dark ? <Moon size={18} className="text-accent" /> : <Sun size={18} className="text-amber-400" />}
              <div>
                <p className="text-white font-medium text-sm">Dark Mode</p>
                <p className="text-sky-400 text-xs">{dark ? 'Dark theme active' : 'Light theme active'}</p>
              </div>
            </div>
            <Toggle value={dark} onChange={() => setTheme(dark ? 'light' : 'dark')} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button type="button" aria-pressed={theme === 'dark'} className={`p-4 rounded-xl border-2 text-left transition-all ${theme === 'dark' ? 'border-accent bg-accent/10' : 'border-white/10'}`}
              onClick={() => setTheme('dark')}>
              <div className="w-full h-12 bg-sky-950 rounded-lg mb-2 border border-sky-800" />
              <p className="text-white text-xs font-medium text-center">Dark</p>
            </button>
            <button type="button" aria-pressed={theme === 'light'} className={`p-4 rounded-xl border-2 text-left transition-all ${theme === 'light' ? 'border-accent bg-accent/10' : 'border-white/10'}`}
              onClick={() => setTheme('light')}>
              <div className="w-full h-12 bg-slate-100 rounded-lg mb-2 border border-slate-200" />
              <p className="text-white text-xs font-medium text-center">Light</p>
            </button>
            <button type="button" aria-pressed={theme === 'system'} className={`p-4 rounded-xl border-2 text-left transition-all ${theme === 'system' ? 'border-accent bg-accent/10' : 'border-white/10'}`}
              onClick={() => setTheme('system')}>
              <div className="w-full h-12 bg-gradient-to-r from-sky-950 to-slate-100 rounded-lg mb-2 border border-white/10 flex items-center justify-center"><Monitor size={16} className="text-accent" /></div>
              <p className="text-white text-xs font-medium text-center">System</p>
            </button>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card">
          <p className="text-white font-semibold mb-4 flex items-center gap-2"><Globe size={15} className="text-accent" /> Language</p>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLang(l.code as any)}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${lang === l.code ? 'bg-accent/20 border-accent/40' : 'bg-white/3 border-white/5 hover:bg-white/8'}`}>
                <span className="text-xl">{l.flag}</span>
                <div>
                  <p className="text-white text-xs font-semibold">{l.label}</p>
                  <p className="text-sky-500 text-[10px]">{l.code.toUpperCase()}</p>
                </div>
                {lang === l.code && <CheckCircle size={12} className="text-accent ml-auto" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Currency */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <p className="text-white font-semibold mb-4 flex items-center gap-2"><DollarSign size={15} className="text-accent" /> Currency</p>
          <div className="grid grid-cols-2 gap-2">
            {CURRENCIES.map(c => (
              <button key={c.code} onClick={() => setCurrency(c.code as any)}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${currency === c.code ? 'bg-accent/20 border-accent/40' : 'bg-white/3 border-white/5 hover:bg-white/8'}`}>
                <span className="text-xl">{c.flag}</span>
                <div>
                  <p className="text-white text-xs font-semibold">{c.symbol} {c.code}</p>
                  <p className="text-sky-500 text-[10px]">{c.label}</p>
                </div>
                {currency === c.code && <CheckCircle size={12} className="text-accent ml-auto" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
          <p className="text-white font-semibold mb-4 flex items-center gap-2"><Bell size={15} className="text-accent" /> Notifications</p>
          <div className="space-y-3">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Booking confirmations and updates' },
              { key: 'push', label: 'Push Notifications', desc: 'Real-time flight alerts' },
              { key: 'sms', label: 'SMS Alerts', desc: 'Critical flight changes only' },
              { key: 'delays', label: 'Delay Alerts', desc: 'Notify when flight is delayed' },
              { key: 'offers', label: 'Special Offers', desc: 'Deals and promotions' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{n.label}</p>
                  <p className="text-sky-500 text-xs">{n.desc}</p>
                </div>
                <Toggle value={notifs[n.key as keyof typeof notifs]}
                  onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card lg:col-span-2">
          <p className="text-white font-semibold mb-4 flex items-center gap-2"><Shield size={15} className="text-accent" /> Privacy & Data</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { key: 'analytics', label: 'Usage Analytics', desc: 'Help improve SkyMind AI' },
              { key: 'marketing', label: 'Marketing Cookies', desc: 'Personalized ads' },
              { key: 'thirdParty', label: 'Third-Party Sharing', desc: 'Share data with partners' },
            ].map(p => (
              <div key={p.key} className="flex items-center justify-between p-4 glass rounded-xl">
                <div>
                  <p className="text-white text-sm font-medium">{p.label}</p>
                  <p className="text-sky-500 text-xs">{p.desc}</p>
                </div>
                <Toggle value={privacy[p.key as keyof typeof privacy]}
                  onChange={() => setPrivacy(prev => ({ ...prev, [p.key]: !prev[p.key as keyof typeof privacy] }))} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
