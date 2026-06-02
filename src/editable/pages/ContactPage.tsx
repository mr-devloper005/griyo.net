'use client'

import { Bell, Mail, MapPin, MessageSquare, Search, Send } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const contactLanes = [
  { icon: Search, title: 'Listing questions', body: 'Ask about categories, search, listing details, and how to compare public posts.' },
  { icon: Bell, title: 'Market requests', body: 'Suggest a new location, topic, service area, or classified category for the site.' },
  { icon: Send, title: 'Seller support', body: 'Share listing updates, corrections, or details that help people contact the right source.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-black">
        <section className="border-b border-black/10 bg-[#ecebea]">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4777f0]">{pagesContent.contact.eyebrow}</p>
              <h1 className="mt-4 text-5xl font-normal uppercase leading-[0.98] sm:text-6xl">{pagesContent.contact.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#596174]">{pagesContent.contact.description}</p>
            </div>
            <div className="grid gap-3 self-end">
              {contactLanes.map((lane) => (
                <div key={lane.title} className="grid grid-cols-[44px_1fr] gap-4 rounded-[5px] border border-black/10 bg-white p-4 shadow-sm">
                  <span className="grid h-11 w-11 place-items-center rounded-[4px] bg-black text-white"><lane.icon className="h-5 w-5" /></span>
                  <div>
                    <h2 className="text-lg font-black">{lane.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-[#596174]">{lane.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1240px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
          <aside className="space-y-4">
            <div className="rounded-[5px] bg-black p-6 text-white">
              <MessageSquare className="h-6 w-6 text-[#8fb0ff]" />
              <h2 className="mt-5 text-3xl font-black leading-tight">Send a clear note.</h2>
              <p className="mt-4 text-sm leading-7 text-white/70">A short message with the category, location, and listing context is usually enough to get started.</p>
            </div>
            <div className="rounded-[5px] border border-black/10 bg-white p-5 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-black"><Mail className="h-4 w-4 text-[#4777f0]" /> General inquiries</p>
              <p className="mt-3 flex items-center gap-2 text-sm font-black"><MapPin className="h-4 w-4 text-[#4777f0]" /> Local classified coverage</p>
            </div>
          </aside>

          <div className="rounded-[5px] border border-black/10 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-3xl font-black">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
