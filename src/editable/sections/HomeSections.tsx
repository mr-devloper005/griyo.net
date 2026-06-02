import Link from 'next/link'
import { ArrowUpRight, Bell, ChevronDown, ChevronRight, Search, Tag } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const popularSearches = ['Local deals', 'Second-hand', 'Property', 'Jobs', 'Services', 'Vehicles']
const dealerNames = ['PORSCHE Salt Lake City', 'FLEMINGS', 'PCAR MARKET', 'Duncan Imports', 'Ryan Friedman']
const questions = [
  'Is this a good deal?',
  'Are there similar listings nearby?',
  'Has the seller shared recent details?',
  'How much should I offer?',
  'What should I check before contacting?',
  'Does it include delivery or pickup?',
]

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function listingStatus(index: number) {
  return ['Details inside', 'Contact seller', 'Recently listed', 'Compare offer', 'Local pickup', 'Open listing'][index % 6]
}

function locationFor(index: number) {
  return ['Bellingham, Washington, USA', 'Mattituck, New York, USA', 'Bridgeton, Missouri, USA', 'Salt Lake City, Utah, USA'][index % 4]
}

function FeaturedListingCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[4px] border border-black/15 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#e9e7e5]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute bottom-0 left-3 bg-black/58 px-3 py-2 text-sm font-bold text-white">🇺🇸 {locationFor(index)}</span>
        <span className="absolute bottom-0 right-3 bg-black/58 px-3 py-2 text-sm font-bold text-white">▧ {12 + index}</span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-xl font-black leading-tight">{post.title}</h3>
        <p className="mt-2 text-xs font-black uppercase">{getEditableCategory(post)}</p>
      </div>
    </Link>
  )
}

function MarketRow({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="grid grid-cols-[96px_1fr_auto] items-center gap-3 rounded-[6px] border border-black/10 bg-white p-2 transition hover:bg-[#f5f8ff]">
      <img src={getEditablePostImage(post)} alt="" className="h-[72px] w-24 rounded-[4px] object-cover" />
      <div className="min-w-0">
        <h3 className="line-clamp-1 text-sm font-black">{post.title}</h3>
        <p className="mt-1 text-xs text-[#697080]">{getEditableExcerpt(post, 70) || getEditableCategory(post)}</p>
      </div>
      <div className="text-right text-sm font-black">
        <p>{listingStatus(index)}</p>
        <span className="mt-1 inline-flex rounded-[4px] bg-[#dce7ff] px-2 py-1 text-[#4777f0]">{index % 5}</span>
      </div>
    </Link>
  )
}

function ActionCard({ icon: Icon, title, copy, button }: { icon: typeof Search; title: string; copy: string; button: string }) {
  return (
    <div className="min-h-[210px] rounded-[4px] border border-black bg-white p-7">
      <div className="flex items-start gap-4">
        <Icon className="h-8 w-8 text-[#4777f0]" />
        <h3 className="text-xl font-black">{title}</h3>
      </div>
      <p className="mt-8 max-w-sm text-base leading-7">{copy}</p>
      <Link href="/classified" className={dc.button.primary + ' mt-8'}>{button}</Link>
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroPost = posts[0]
  const heroHref = heroPost ? postHref(primaryTask, heroPost, primaryRoute) : primaryRoute
  const title = pagesContent.home.hero.title.join(' ') || 'Follow the market'

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:px-8 lg:py-20">
        <div>
          <h1 className="max-w-md text-5xl font-normal uppercase leading-[0.98] tracking-normal sm:text-6xl">{title}</h1>
          <p className="mt-8 max-w-lg text-base leading-7">Whether it is a local bargain, a second-hand find, a property lead, a job opportunity, or a nearby service, {SITE_CONFIG.name} helps people find, price, and compare practical listings.</p>
          <form action="/search" className="mt-12 flex max-w-[520px] overflow-hidden rounded-[5px] border border-black/20 bg-white">
            <input name="q" placeholder="Search classifieds (e.g. apartment, bike, sofa)" className="min-w-0 flex-1 px-4 py-3 text-sm outline-none placeholder:text-[#8a91a3]" />
            <button className="grid w-14 place-items-center bg-[#4777f0] text-white" aria-label="Search"><Search className="h-5 w-5" /></button>
          </form>
          <p className="mt-5 text-sm text-[#596174]">Popular Searches</p>
          <div className="mt-3 flex max-w-xl flex-wrap gap-2">
            {popularSearches.map((item) => <Link key={item} href={`/search?q=${encodeURIComponent(item)}`} className="rounded-full border border-[#7a8292] px-3 py-1.5 text-sm text-[#4e5668]">{item}</Link>)}
          </div>
        </div>

        <Link href={heroHref} className="group">
          <div className="relative overflow-hidden rounded-[8px] bg-[#e8e6e3]">
            <img src={heroPost ? getEditablePostImage(heroPost) : '/placeholder.svg?height=900&width=1400'} alt={heroPost?.title || SITE_CONFIG.name} className="aspect-[16/10.5] w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute bottom-2 left-0 right-0 mx-auto flex w-[74%] items-center overflow-hidden rounded-[4px] bg-white shadow-md">
              <span className="bg-black px-2 py-1 text-xs font-black uppercase text-white">For sale</span>
              <span className="min-w-0 flex-1 truncate px-4 text-sm font-medium">{heroPost?.title || `Featured ${taskLabel(primaryTask)}`}</span>
              <span className="px-3 text-sm font-black">{listingStatus(0)}</span>
              <span className="grid h-9 w-9 place-items-center bg-white text-[#4777f0]"><ArrowUpRight className="h-5 w-5" /></span>
            </div>
          </div>
          <div className="mx-auto mt-2 flex w-44 justify-center gap-2">
            <span className="h-4 w-16 rounded-[3px] bg-[#707789]" />
            {[1, 2, 3, 4].map((item) => <span key={item} className="h-4 w-5 rounded-[5px] bg-[#ecebea]" />)}
          </div>
        </Link>
      </div>

      <div className="bg-[#ecebea]">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
          <ActionCard icon={Search} title="Search listings for sale" copy="Compare public posts from sellers, businesses, and local services in one clean place." button="Browse listings" />
          <ActionCard icon={Bell} title="Get market alerts" copy="Watch categories you care about and return quickly when new posts match your search." button="Browse markets" />
          <ActionCard icon={Tag} title="Sell your item" copy="Reach people who are actively comparing offers and looking for practical local options." button="List your item" />
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail(_props: HomeSectionProps) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.36fr_0.64fr] lg:px-8">
        <div>
          <h2 className="text-5xl font-normal leading-[0.98]">Ask<br />Griyo™</h2>
          <p className="mt-10 max-w-sm text-xl leading-7">A quick research companion for comparing listings, reading details, and preparing better questions.</p>
          <Link href="/search" className={dc.button.primary + ' mt-9'}>Learn more</Link>
        </div>
        <div className="relative min-h-[420px]">
          <div className="absolute inset-y-0 left-0 right-[18%] flex flex-col justify-center gap-5">
            {questions.map((question, index) => (
              <div key={question} className={`text-xl ${index === 0 ? 'rounded-[4px] border-2 border-[#4777f0] bg-[#eef4ff] px-4 py-3 font-black' : index > 3 ? 'text-black/25' : 'text-black/55'}`}>{question}</div>
            ))}
          </div>
          <div className="absolute right-0 top-24">
            <div className="rounded-[4px] bg-[#4777f0] px-4 py-3 font-mono text-xl font-black uppercase tracking-[0.16em] text-white">How can I help?</div>
            <div className="ml-20 mt-6 grid h-36 w-36 place-items-center rounded-full border-4 border-black bg-[#dce7ff] text-5xl">⌕</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts.slice(0, 6)
  return (
    <>
      <section className="bg-[#ecebea] py-20 text-center">
        <h2 className="mx-auto max-w-3xl px-4 text-3xl font-black leading-tight">Search listings from auctions, dealers, private sellers, and local posters, all in one place.</h2>
        <div className="mx-auto mt-12 flex max-w-[980px] items-center justify-between gap-6 px-4">
          {dealerNames.map((name) => <div key={name} className="text-center text-sm font-black uppercase tracking-tight">{name}</div>)}
          <ChevronRight className="h-6 w-6 shrink-0" />
        </div>
        <p className="mt-16 text-xl"><strong>Posters:</strong> Include your listing on {SITE_CONFIG.name} <Link href="/contact" className="text-[#4777f0]">Learn more &gt;</Link></p>
      </section>

      {featured.length ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-normal uppercase">Featured listings</h2>
            <div className="mt-8 grid gap-1 md:grid-cols-3">
              {featured.slice(0, 3).map((post, index) => <FeaturedListingCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const marketPosts = (timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts).slice(0, 8)
  if (!marketPosts.length) return null
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-normal uppercase">Featured markets</h2>
        <div className="mt-20 grid gap-6 lg:grid-cols-[minmax(0,1fr)_395px]">
          <div>
            <div className="grid grid-cols-[1fr_120px_120px] px-32 pb-3 text-xs font-black">
              <span>Market</span><span>CMB ●</span><span>For Sale</span>
            </div>
            <div className="grid gap-2">
              {marketPosts.map((post, index) => <MarketRow key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          </div>
          <Link href={postHref(primaryTask, marketPosts[0], primaryRoute)} className="grid grid-cols-[120px_1fr] gap-4 rounded-[6px] border border-black/10 bg-white p-3 shadow-sm">
            <img src={getEditablePostImage(marketPosts[0])} alt="" className="h-24 w-[120px] object-cover" />
            <div>
              <h3 className="text-base font-black">{marketPosts[0].title}</h3>
              <p className="mt-2 text-sm">Market <strong>{listingStatus(1)}</strong></p>
              <p className="mt-2 text-sm">For Sale <span className="rounded-[4px] bg-[#dce7ff] px-2 py-1 font-black text-[#4777f0]">77</span></p>
              <button className="mt-4 rounded-[4px] border border-[#4777f0] px-5 py-2 text-xs font-black uppercase text-[#4777f0]">Follow</button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  const faqs = [
    `What is ${SITE_CONFIG.name}?`,
    `Is ${SITE_CONFIG.name} free to use?`,
    `How can I list an item on ${SITE_CONFIG.name}?`,
    'What is my item worth?',
    'What do you count as a local classified?',
    'How can I contact you?',
  ]
  return (
    <section className="bg-[#ecebea] py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-normal uppercase">Frequently asked questions</h2>
        <div className="mt-12 grid gap-3">
          {faqs.map((faq) => (
            <details key={faq} className="group rounded-[6px] bg-white px-6 py-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between text-2xl font-black">{faq}<ChevronDown className="h-5 w-5 transition group-open:rotate-180" /></summary>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#596174]">Use the site to browse public posts, compare details, and contact the relevant poster when the information looks useful.</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
