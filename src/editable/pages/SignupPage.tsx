import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ClipboardList, Search, UserPlus } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-black">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1240px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#4777f0]"><UserPlus className="h-4 w-4" /> Sign up</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-normal uppercase leading-[0.98] sm:text-6xl">Create your Griyo access.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#596174]">Save local searches, return to useful posts, and keep a lightweight account for testing this public site experience.</p>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                { icon: Search, title: 'Search faster' },
                { icon: ClipboardList, title: 'Track listings' },
                { icon: CheckCircle2, title: 'Keep context' },
              ].map((item) => (
                <div key={item.title} className="rounded-[5px] border border-black/10 bg-[#f7f7f7] p-4">
                  <item.icon className="h-5 w-5 text-[#4777f0]" />
                  <p className="mt-4 text-sm font-black uppercase">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[5px] border border-black/10 bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:p-7">
            <h2 className="text-3xl font-black">Create account</h2>
            <p className="mt-2 text-sm leading-6 text-[#596174]">Use local browser storage for this demo account.</p>
            <EditableLocalSignupForm />
            <p className="mt-5 text-sm text-[#596174]">Already have an account? <Link href="/login" className="font-black text-[#4777f0] underline-offset-4 hover:underline">Sign in</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
