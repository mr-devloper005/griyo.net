import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, getEditableCategory } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

function stripHtml(value: string) {
  let text = value.replace(/<[^>]*>/g, ' ')
  text = text.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  text = text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  text = text.replace(/<[^>]*>/g, ' ')
  return text.replace(/\s+/g, ' ').trim()
}

const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => {
  const raw = post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
  return stripHtml(raw)
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function locationFor(index: number) {
  return ['Bellingham, WA', 'Mattituck, NY', 'Bridgeton, MO', 'Salt Lake City, UT'][index % 4]
}

function ListingCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getEditablePostImage(post)
  const summary = summaryOf(post)
  const category = getEditableCategory(post)
  const wide = index % 7 === 0

  if (wide) {
    return (
      <Link href={href} className="group col-span-full grid overflow-hidden rounded-[4px] border border-black/15 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(0,0,0,0.16)] md:grid-cols-[340px_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#e9e7e5] md:aspect-auto md:min-h-[220px]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-col justify-center p-5 sm:p-6">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#4777f0]">{category}</p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight">{post.title}</h3>
          {summary ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#596174]">{summary}</p> : null}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-[#697080]">{locationFor(index)}</span>
            <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-[#4777f0]">View <ArrowUpRight className="h-3.5 w-3.5" /></span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group overflow-hidden rounded-[4px] border border-black/15 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e9e7e5]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute bottom-0 left-0 bg-black/60 px-3 py-1.5 text-xs font-bold text-white">{locationFor(index)}</span>
      </div>
      <div className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#4777f0]">{category}</p>
        <h3 className="mt-2 line-clamp-2 text-base font-black leading-tight">{post.title}</h3>
        {summary ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#596174]">{summary}</p> : null}
      </div>
    </Link>
  )
}

function MarketRow({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getEditablePostImage(post)

  return (
    <Link href={href} className="grid grid-cols-[80px_1fr_auto] items-center gap-3 rounded-[6px] border border-black/10 bg-white p-2 transition hover:bg-[#f5f8ff]">
      <img src={image} alt="" className="h-[60px] w-20 rounded-[4px] object-cover" />
      <div className="min-w-0">
        <h3 className="line-clamp-1 text-sm font-black">{post.title}</h3>
        <p className="mt-1 text-xs text-[#697080]">{getEditableCategory(post)}</p>
      </div>
      <span className="inline-flex rounded-[4px] bg-[#dce7ff] px-2 py-1 text-xs font-black text-[#4777f0]">{index + 1}</span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)
  const topResults = results.slice(0, 12)
  const moreResults = results.slice(12, 20)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-black">
        {/* Hero search */}
        <section className="bg-black text-white">
          <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#4777f0]">{pagesContent.search.hero.badge}</p>
            <h1 className="mt-4 max-w-lg text-5xl font-normal uppercase leading-[0.98] tracking-normal sm:text-6xl">{pagesContent.search.hero.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70">{pagesContent.search.hero.description}</p>

            <form action="/search" className="mt-10 max-w-[640px]">
              <input type="hidden" name="master" value="1" />
              <div className="flex overflow-hidden rounded-[5px] border border-white/20 bg-white">
                <Search className="my-auto ml-4 h-5 w-5 text-[#8a91a3]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 px-3 py-3 text-sm font-medium text-black outline-none placeholder:text-[#8a91a3]" />
                <button className="bg-[#4777f0] px-5 text-sm font-black uppercase text-white" type="submit">Search</button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 overflow-hidden rounded-[5px] border border-white/20 bg-white">
                  <Filter className="ml-3 h-4 w-4 text-[#8a91a3]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 py-3 pr-3 text-sm font-medium text-black outline-none placeholder:text-[#8a91a3]" />
                </label>
                <select name="task" defaultValue={task} className="rounded-[5px] border border-white/20 bg-white px-3 py-3 text-sm font-black text-black outline-none">
                  <option value="">All types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
                <button type="submit" className="rounded-[5px] border border-white/20 bg-white px-5 py-3 text-sm font-black uppercase text-black transition hover:bg-white/90">Refine</button>
              </div>
            </form>
          </div>
        </section>

        {/* Results header */}
        <section className="bg-[#ecebea]">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase">
              {results.length} {results.length === 1 ? 'result' : 'results'}
              {query ? <span className="font-normal normal-case text-[#596174]"> for &ldquo;{query}&rdquo;</span> : null}
            </p>
            <Link href="/classified" className="inline-flex items-center gap-2 rounded-[4px] border border-black/20 bg-white px-4 py-2 text-xs font-black uppercase transition hover:bg-black/[0.03]">
              Browse all listings <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Results grid */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            {topResults.length ? (
              <>
                <h2 className="text-3xl font-normal uppercase">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {topResults.map((post, index) => <ListingCard key={post.id || post.slug} post={post} index={index} />)}
                </div>
              </>
            ) : (
              <div className="rounded-[4px] border border-dashed border-black/20 bg-[#ecebea] p-12 text-center">
                <p className="text-2xl font-black">No matching listings found.</p>
                <p className="mt-3 text-sm text-[#596174]">Try a different keyword, type, or category.</p>
              </div>
            )}
          </div>
        </section>

        {/* More results as compact rows */}
        {moreResults.length ? (
          <section className="bg-[#ecebea] py-12">
            <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-normal uppercase">More listings</h2>
              <div className="mt-6 grid gap-2">
                {moreResults.map((post, index) => <MarketRow key={post.id || post.slug} post={post} index={index + 12} />)}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </EditableSiteShell>
  )
}
