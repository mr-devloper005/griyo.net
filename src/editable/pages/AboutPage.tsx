import Link from 'next/link'
import { CheckCircle2, MapPin, Search, ShieldCheck } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const stats = ['Local browsing', 'Seller context', 'Cleaner comparisons']

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-black">
        <section className="border-b border-black/10 bg-black text-white">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:py-20">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/55">{pagesContent.about.badge}</p>
              <h1 className="mt-5 text-5xl font-normal uppercase leading-[0.98] sm:text-6xl">About Griyo</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/72">{pagesContent.about.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/classified" className="rounded-[4px] bg-[#4777f0] px-5 py-3 text-sm font-black uppercase text-white">Browse classified</Link>
                <Link href="/contact" className="rounded-[4px] border border-white px-5 py-3 text-sm font-black uppercase text-white hover:bg-white hover:text-black">Contact</Link>
              </div>
            </div>
            <div className="grid gap-3 self-end">
              {stats.map((item, index) => (
                <div key={item} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-[4px] border border-white/15 bg-white/8 p-4">
                  <span className="text-3xl font-normal text-white/45">{String(index + 1).padStart(2, '0')}</span>
                  <strong className="text-2xl font-black uppercase">{item}</strong>
                  <CheckCircle2 className="h-5 w-5 text-[#8fb0ff]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1240px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <article className="rounded-[5px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-4xl font-normal uppercase">A better way to compare local options</h2>
            <div className="article-content mt-8 grid gap-5 text-base leading-8 text-[#596174]">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>

          <aside className="space-y-3">
            {[
              { icon: Search, title: 'Find faster', body: 'Search-first pages keep listings, posts, and useful resources easy to scan.' },
              { icon: MapPin, title: 'Local context', body: 'Location, seller notes, and category details stay visible without clutter.' },
              { icon: ShieldCheck, title: 'Practical browsing', body: 'The site avoids noisy claims and focuses on clear public information.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[5px] border border-black/10 bg-[#f7f7f7] p-5">
                <item.icon className="h-5 w-5 text-[#4777f0]" />
                <h3 className="mt-4 text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#596174]">{item.body}</p>
              </div>
            ))}
          </aside>
        </section>

        <section className="bg-[#ecebea]">
          <div className="mx-auto grid max-w-[1240px] gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
            {pagesContent.about.values.map((value) => (
              <div key={value.title} className="rounded-[5px] border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#596174]">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
