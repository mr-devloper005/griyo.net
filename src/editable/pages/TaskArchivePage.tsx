import Link from 'next/link'
import { ArrowRight, Bookmark, BriefcaseBusiness, Camera, Download, FileText, Filter, Image as ImageIcon, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singles = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singles].filter(Boolean)
}
const getImage = (post: SitePost) => getImages(post)[0] || '/placeholder.svg?height=900&width=1200'
const getSummary = (post: SitePost) => (post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || '').replace(/<[^>]*>/g, ' ')
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const listingStatus = (post: SitePost, index: number) => getField(post, ['condition', 'availability', 'type']) || ['Details inside', 'Contact seller', 'Recently listed', 'Compare offer', 'Local pickup', 'Open listing'][index % 6]
const locationFor = (post: SitePost, index: number) => getField(post, ['location', 'address', 'city']) || ['Bellingham, Washington, USA', 'Mattituck, New York, USA', 'Bridgeton, Missouri, USA', 'Salt Lake City, Utah, USA'][index % 4]

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; label: string }> = {
  article: { icon: FileText, label: 'Story' },
  listing: { icon: BriefcaseBusiness, label: 'Dealer' },
  classified: { icon: Search, label: 'For sale' },
  image: { icon: Camera, label: 'Gallery' },
  sbm: { icon: Bookmark, label: 'Saved' },
  pdf: { icon: Download, label: 'Data' },
  profile: { icon: UserRound, label: 'Seller' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const deck = taskDeck[task]
  const Icon = deck.icon
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const first = posts[0]

  return (
    <EditableSiteShell>
      <main className="bg-white text-black">
        <section className="border-b border-black/10 bg-[#f7f7f7]">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#4777f0]"><Icon className="h-4 w-4" /> {taskConfig?.label || task}</p>
              <h1 className="mt-4 text-5xl font-normal uppercase leading-[0.98] sm:text-6xl">{voice?.headline || `Find ${taskConfig?.label || task}`}</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#596174]">{voice?.description || SITE_CONFIG.description}</p>
              <form action="/search" className="mt-8 flex max-w-xl overflow-hidden rounded-[4px] border border-black/20 bg-white">
                <input name="q" placeholder={`Search ${taskConfig?.label || 'posts'}`} className="min-w-0 flex-1 px-4 py-3 text-sm outline-none" />
                <button className="grid w-14 place-items-center bg-[#4777f0] text-white"><Search className="h-5 w-5" /></button>
              </form>
            </div>
            {first ? (
              <Link href={`${basePath}/${first.slug}`} className="group overflow-hidden rounded-[5px] border border-black/15 bg-white shadow-sm">
                <div className="relative aspect-[16/9] bg-[#ebe9e7]">
                  <img src={getImage(first)} alt={first.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-3 left-3 bg-black px-2 py-1 text-xs font-black uppercase text-white">{deck.label}</span>
                  <span className="absolute bottom-3 left-24 bg-white px-3 py-1 text-sm font-black">{listingStatus(first, 0)}</span>
                </div>
                <div className="p-4">
                  <h2 className="text-2xl font-black leading-tight">{first.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#596174]">{getSummary(first)}</p>
                </div>
              </Link>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
          <form action={basePath} className="mb-8 grid gap-3 rounded-[5px] border border-black/15 bg-white p-4 shadow-sm sm:grid-cols-[1fr_260px_140px] sm:items-center">
            <div className="flex items-center gap-2 text-sm font-black uppercase"><Filter className="h-4 w-4 text-[#4777f0]" /> Showing {categoryLabel}</div>
            <select name="category" defaultValue={category} className="h-11 rounded-[4px] border border-black/20 bg-white px-3 text-sm font-bold outline-none">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="h-11 rounded-[4px] bg-[#4777f0] text-sm font-black uppercase text-white">Apply</button>
          </form>

          {posts.length ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="grid gap-2">
                {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
              </div>
              <aside className="hidden self-start rounded-[5px] border border-black/10 bg-white p-4 shadow-sm lg:block">
                <h2 className="text-xl font-black">Market snapshot</h2>
                <p className="mt-2 text-sm leading-6 text-[#596174]">Compact rows make it easier to compare title, location, category, and availability without losing the rhythm of the page.</p>
                <div className="mt-5 grid gap-2">
                  {posts.slice(0, 4).map((post, index) => (
                    <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="grid grid-cols-[84px_1fr] gap-3 border-t border-black/10 pt-3">
                      <img src={getImage(post)} alt="" className="h-16 w-[84px] object-cover" />
                      <span className="text-sm font-black leading-tight">{post.title}<span className="mt-1 block text-[#4777f0]">{listingStatus(post, index)}</span></span>
                    </Link>
                  ))}
                </div>
              </aside>
            </div>
          ) : (
            <div className="rounded-[5px] border border-dashed border-black/25 bg-[#f7f7f7] p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-[#4777f0]" />
              <h2 className="mt-4 text-3xl font-black">No posts found</h2>
              <p className="mt-2 text-sm text-[#596174]">Try another category or search term.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-[4px] border border-black/20 bg-white px-5 py-3 text-sm font-black uppercase">Previous</Link> : null}
            <span className="rounded-[4px] bg-black px-5 py-3 text-sm font-black uppercase text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-[4px] border border-black/20 bg-white px-5 py-3 text-sm font-black uppercase">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} index={index} />
  return <ClassifiedArchiveCard post={post} href={href} index={index} task={task} />
}

function ClassifiedArchiveCard({ post, href, index, task }: { post: SitePost; href: string; index: number; task: TaskKey }) {
  return (
    <Link href={href} className={`group grid overflow-hidden rounded-[5px] border border-black/10 bg-white transition hover:bg-[#f4f7ff] hover:shadow-md ${index % 3 === 0 ? 'md:grid-cols-[260px_1fr_180px]' : 'md:grid-cols-[160px_1fr_150px]'}`}>
      <div className="relative min-h-[150px] bg-[#ebe9e7]">
        <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute bottom-2 left-2 bg-black/65 px-2 py-1 text-xs font-bold text-white">🇺🇸 {locationFor(post, index)}</span>
      </div>
      <div className="min-w-0 p-4">
        <p className="text-xs font-black uppercase text-[#4777f0]">{taskDeck[task].label}</p>
        <h2 className="mt-2 line-clamp-2 text-2xl font-black leading-tight">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#596174]">{getSummary(post) || getCategory(post, 'Listing')}</p>
      </div>
      <div className="border-t border-black/10 p-4 md:border-l md:border-t-0">
        <p className="bg-black px-2 py-1 text-center text-xs font-black uppercase text-white">For sale</p>
        <p className="mt-3 text-xl font-black">{listingStatus(post, index)}</p>
        <p className="mt-4 inline-flex items-center gap-1 text-sm font-black uppercase text-[#4777f0]">View <ArrowRight className="h-4 w-4" /></p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return <ClassifiedArchiveCard post={post} href={href} index={index} task="listing" />
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[5px] border border-black/10 bg-white transition hover:shadow-md md:grid-cols-[220px_1fr]">
      <img src={getImage(post)} alt="" className={`w-full object-cover ${index % 2 ? 'h-56' : 'h-72'} md:h-full`} />
      <div className="p-5">
        <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#4777f0]"><ImageIcon className="h-4 w-4" /> Gallery</p>
        <h2 className="mt-4 text-2xl font-black leading-tight">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#596174]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="grid rounded-[5px] border border-black/10 bg-white p-5 transition hover:bg-black hover:text-white sm:grid-cols-[90px_1fr_auto] sm:items-center">
      <span className="text-4xl font-normal">{String(index + 1).padStart(2, '0')}</span>
      <span><strong className="block text-xl">{post.title}</strong><span className="mt-2 line-clamp-2 text-sm opacity-70">{getSummary(post)}</span></span>
      <Bookmark className="mt-4 h-5 w-5 sm:mt-0" />
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="grid rounded-[5px] border border-black/10 bg-white p-5 transition hover:bg-[#f4f7ff] sm:grid-cols-[80px_1fr_auto] sm:items-center">
      <FileText className="h-10 w-10 text-[#4777f0]" />
      <span><strong className="block text-xl">{post.title}</strong><span className="mt-2 line-clamp-2 text-sm text-[#596174]">{getSummary(post)}</span></span>
      <Download className="mt-4 h-5 w-5 sm:mt-0" />
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="grid rounded-[5px] border border-black/10 bg-white p-5 transition hover:bg-[#f4f7ff] sm:grid-cols-[90px_1fr_auto] sm:items-center">
      <img src={getImage(post)} alt="" className="h-20 w-20 rounded-full object-cover" />
      <span><strong className="block text-xl">{post.title}</strong><span className="mt-2 line-clamp-2 text-sm text-[#596174]">{getSummary(post) || getField(post, ['role', 'company', 'location'])}</span></span>
      <UserRound className="mt-4 h-5 w-5 text-[#4777f0] sm:mt-0" />
    </Link>
  )
}
