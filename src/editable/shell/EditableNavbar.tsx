'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, User, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import griyoLogo from '@/editable/assets/griyo-logo.png'

const logoSrc = typeof griyoLogo === 'string' ? griyoLogo : griyoLogo.src

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-3 whitespace-nowrap text-white">
      <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-[4px] bg-white">
        <img src={logoSrc} alt="" className="h-full w-full object-contain" />
      </span>
      <span className="inline-flex items-baseline gap-1 text-[22px] font-black uppercase tracking-[0.26em]">
        <span>GRIYO</span>
      </span>
    </span>
  )
}

const mainLinks = [
  { label: 'Home', href: '/' },
  { label: 'Classified', href: '/classified' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Sign Up', href: '/signup' },
  { label: 'Sign In', href: '/login' },
] as const

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const navItems = mainLinks

  useEffect(() => {
    const head = document.head
    let icon = head.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!icon) {
      icon = document.createElement('link')
      icon.rel = 'icon'
      head.appendChild(icon)
    }
    icon.type = 'image/png'
    icon.href = logoSrc

    let shortcut = head.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]')
    if (!shortcut) {
      shortcut = document.createElement('link')
      shortcut.rel = 'shortcut icon'
      head.appendChild(shortcut)
    }
    shortcut.type = 'image/png'
    shortcut.href = logoSrc
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white">
      <nav className="mx-auto grid min-h-[50px] w-full max-w-[1240px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="justify-self-start" aria-label={`${SITE_CONFIG.name} home`}>
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-12 justify-self-center lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className={`text-sm font-black uppercase tracking-normal transition ${active ? 'text-white' : 'text-white/82 hover:text-white'}`}>
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4 justify-self-end">
          <Link href="/search" className="grid h-9 w-9 place-items-center rounded-[4px] text-white hover:bg-white/10" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/login" className="hidden h-9 w-9 place-items-center rounded-[4px] border border-[#4777f0] text-white hover:bg-white/10 sm:grid" aria-label="Login">
            <User className="h-5 w-5 fill-current" />
          </Link>
          <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-9 w-9 place-items-center rounded-[4px] border border-white/20 lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-black px-4 py-4 lg:hidden">
          <form action="/search" className="mx-auto flex max-w-[1240px] overflow-hidden rounded-[4px] border border-white/20 bg-white">
            <input name="q" type="search" placeholder="Search listings" className="min-w-0 flex-1 px-4 py-3 text-sm font-medium text-black outline-none" />
            <button className="bg-[#4777f0] px-4 text-white"><Search className="h-5 w-5" /></button>
          </form>
          <div className="mx-auto mt-4 grid max-w-[1240px] gap-2">
            {navItems.map((item) => (
              <Link key={`${item.href}-${item.label}`} href={item.href} onClick={() => setOpen(false)} className="border border-white/10 px-4 py-3 text-sm font-black uppercase">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
