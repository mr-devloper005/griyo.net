import Link from 'next/link'
import { Instagram, Mail, Play, Search } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import griyoLogo from '@/editable/assets/griyo-logo.png'

const logoSrc = typeof griyoLogo === 'string' ? griyoLogo : griyoLogo.src

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3 whitespace-nowrap text-white">
      <span className={`${small ? 'h-9 w-9' : 'h-11 w-11'} grid place-items-center overflow-hidden rounded-[4px] bg-white`}>
        <img src={logoSrc} alt="" className="h-full w-full object-contain" />
      </span>
      <span className={`inline-flex items-baseline gap-1 font-black uppercase ${small ? 'text-[20px] tracking-[0.22em]' : 'text-[24px] tracking-[0.26em]'}`}>
        <span>GRIYO</span>
      </span>
    </span>
  )
}

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Classified', href: '/classified' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Sign Up', href: '/signup' },
  { label: 'Sign In', href: '/login' },
] as const

export function EditableFooter() {
  return (
    <footer className="bg-black text-white">
      <section className="border-b border-white/15">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="relative min-h-[230px] overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[150px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.22),rgba(0,0,0,0)_70%)]" />
            <div className="absolute left-8 right-8 top-16 h-20 rounded-full border border-white/20 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.18),rgba(255,255,255,0.03))] shadow-[0_50px_80px_rgba(255,255,255,0.08)]" />
            <div className="absolute left-[18%] right-[18%] top-24 h-10 border-t border-white/35" />
          </div>
          <div>
            <p className="text-xl font-black uppercase tracking-[0.24em]"><BrandMark small /></p>
            <h2 className="mt-4 text-2xl font-normal">What is your listing worth?</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-white/78">Track recent examples, compare local options, and save the posts you want to revisit.</p>
            <Link href="/classified" className="mt-5 inline-flex rounded-[4px] border border-white px-6 py-3 text-sm font-black uppercase hover:bg-white hover:text-black">Get started</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-10 px-4 py-9 sm:px-6 md:grid-cols-[1.25fr_1fr_1.1fr] lg:px-8">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-sm text-base leading-7 text-white/70">{globalContent.footer.description}</p>
          <p className="mt-7 text-xs font-bold uppercase text-white/55">Connect with us</p>
          <div className="mt-3 flex gap-3">
            {[Instagram, Play, Mail].map((Icon, index) => <span key={index} className="grid h-6 w-6 place-items-center rounded-[3px] bg-white text-black"><Icon className="h-4 w-4" /></span>)}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase text-white/55">Links</h3>
            <div className="mt-4 grid gap-2">
            {footerLinks.map((link) => <Link key={link.href} href={link.href} className="text-base font-normal uppercase hover:text-[#8fb0ff]">{link.label}</Link>)}
            </div>
          </div>

        <div>
          <h3 className="text-xs font-bold uppercase text-white/55">Get our newsletter</h3>
          <form action="/search" className="mt-4 flex gap-2">
            <input name="q" placeholder="Email Address" className="min-w-0 flex-1 rounded-[4px] bg-white/25 px-4 py-3 text-white outline-none placeholder:text-white/60" />
            <button className="rounded-[4px] border border-white px-5 text-sm font-black uppercase">Sign up</button>
          </form>
          <Link href="/search" className="mt-4 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"><Search className="h-4 w-4" /> Search the archive</Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] border-t border-white/14 px-4 py-5 text-center text-xs leading-6 text-white/52 sm:px-6 lg:px-8">
        <p>All rights reserved, {SITE_CONFIG.name}.</p>
        <p>{globalContent.footer.bottomNote}</p>
      </section>
    </footer>
  )
}
