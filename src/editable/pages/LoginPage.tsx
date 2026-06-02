import type { Metadata } from 'next'
import Link from 'next/link'
import { Bookmark, LogIn, Search, ShieldCheck } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: 'Local login page for this public site.' })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-black">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1240px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[430px_minmax(0,1fr)] lg:items-center lg:px-8">
          <div className="rounded-[5px] border border-black/10 bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:p-7">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#4777f0]"><LogIn className="h-4 w-4" /> Sign in</p>
            <h1 className="mt-4 text-3xl font-black">Welcome back</h1>
            <p className="mt-2 text-sm leading-6 text-[#596174]">Sign in with the local account you created in this browser.</p>
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm text-[#596174]">New here? <Link href="/signup" className="font-black text-[#4777f0] underline-offset-4 hover:underline">Create an account</Link></p>
          </div>

          <div className="rounded-[5px] bg-black p-8 text-white lg:p-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/55">Member access</p>
            <h2 className="mt-5 max-w-2xl text-5xl font-normal uppercase leading-[0.98] sm:text-6xl">Return to your saved classified flow.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70">Use sign in to keep testing account-based paths while the public listing routes remain available to everyone.</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Search, title: 'Find' },
                { icon: Bookmark, title: 'Save' },
                { icon: ShieldCheck, title: 'Return' },
              ].map((item) => (
                <div key={item.title} className="rounded-[5px] border border-white/15 bg-white/8 p-4">
                  <item.icon className="h-5 w-5 text-[#8fb0ff]" />
                  <p className="mt-4 text-sm font-black uppercase">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
