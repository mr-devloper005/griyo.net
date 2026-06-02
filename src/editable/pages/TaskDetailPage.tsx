import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Camera, CheckCircle2, ExternalLink, FileText, MapPin, MessageCircle, Phone, Search, Share2, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

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
  return [...media, ...images, ...singles].filter(Boolean).slice(0, 14)
}
const getBody = (post: SitePost) => asText(getContent(post).body) || asText(getContent(post).description) || asText(getContent(post).details) || post.summary || 'Details will appear here once available.'
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const linkifyText = (value: string) =>
  value.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
    const safeUrl = escapeHtml(url)
    return `<a href="${safeUrl}" target="_blank" rel="noreferrer">${safeUrl}</a>`
  })

const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_match, label: string, url: string) => {
    const safeUrl = escapeHtml(url)
    const safeLabel = escapeHtml(label)
    return `<a href="${safeUrl}" target="_blank" rel="noreferrer">${safeLabel}</a>`
  })

const sanitizeHtml = (value: string) =>
  value
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\s(href|src)=["']\s*javascript:[^"']*["']/gi, '')

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const listingStatus = (post: SitePost) => getField(post, ['condition', 'availability', 'type']) || 'Contact seller'
const locationOf = (post: SitePost) => getField(post, ['location', 'address', 'city']) || 'Mattituck, New York, USA'
const sellerOf = (post: SitePost) => getField(post, ['seller', 'company', 'author', 'name']) || 'Superior Motors'

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main className="bg-white text-black">
        {task === 'classified' || task === 'listing' ? <MarketplaceDetail task={task} post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-black uppercase text-[#4777f0]"><ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}</Link>
}

function StickyHeader({ task, post }: { task: TaskKey; post: SitePost }) {
  return (
    <div className="sticky top-[50px] z-30 border-b border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
      <div className="mx-auto grid max-w-[1240px] gap-4 px-4 py-3 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div>
          <h1 className="line-clamp-2 text-3xl font-black leading-tight">{post.title}</h1>
          <div className="mt-2 flex flex-wrap gap-5 text-sm text-[#596174]">
            <span>VIN: {getField(post, ['vin', 'sku', 'id']) || post.id}</span>
            <span className="inline-flex items-center gap-1"><Search className="h-4 w-4" /> 828</span>
            <span className="inline-flex items-center gap-1"><Bookmark className="h-4 w-4" /> Save</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          <span className="bg-black px-2 py-1 text-xs font-black uppercase text-white">{task === 'classified' ? 'For sale' : categoryOf(post, 'Listing')}</span>
          <span className="text-2xl font-black">{listingStatus(post)}</span>
          <Link href="#contact-seller" className="rounded-[4px] bg-[#4777f0] px-5 py-3 text-sm font-black uppercase text-white">Contact seller</Link>
        </div>
      </div>
    </div>
  )
}

function MarketplaceDetail({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0] || '/placeholder.svg?height=900&width=1400'
  const phone = getField(post, ['phone', 'telephone', 'mobile']) || '631-866-0682'
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <StickyHeader task={task} post={post} />
      <section className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8">
        <BackLink task={task} />
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/" className="underline">Home</Link><span>›</span><Link href={getTaskConfig(task)?.route || '/'} className="underline">{getTaskConfig(task)?.label}</Link><span>›</span><span>{post.title}</span><Share2 className="h-4 w-4 text-[#4777f0]" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <div className="overflow-hidden rounded-[4px] border-[6px] border-[#4777f0] border-l-[120px] bg-[#f5f5f5]">
              <div className="relative min-h-[460px]">
                <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-[4px] bg-[#ffd777] px-3 py-2 text-lg font-black uppercase">↑ Featured</span>
                <span className="absolute bottom-4 left-4 rounded-[4px] bg-black/72 px-3 py-2 text-sm font-bold text-white">{sellerOf(post)}</span>
                <button className="absolute bottom-4 right-4 rounded-[4px] bg-white px-4 py-2 text-sm font-black uppercase text-[#4777f0]">View all ({Math.max(images.length, 1)})</button>
              </div>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {(images.slice(1, 3).length ? images.slice(1, 3) : [hero, hero]).map((image, index) => (
                <div key={`${image}-${index}`} className="grid h-40 place-items-center overflow-hidden rounded-[4px] bg-black text-white">
                  <img src={image} alt="" className="h-full w-full object-cover opacity-65" />
                </div>
              ))}
            </div>
          </article>
          <aside id="contact-seller" className="self-start rounded-[5px] border border-black/10 bg-white p-4 shadow-[0_8px_26px_rgba(0,0,0,0.14)] lg:sticky lg:top-[150px]">
            <div className="flex items-start justify-between">
                <div><span className="bg-black px-2 py-1 text-xs font-black uppercase text-white">For sale</span><p className="mt-2 text-2xl font-black">{listingStatus(post)}</p></div>
              <span className="text-3xl">×</span>
            </div>
            <div className="mt-6 flex gap-3">
              <div>
                <h2 className="text-lg font-black">{sellerOf(post)} <CheckCircle2 className="inline h-4 w-4 fill-[#00a862] text-white" /></h2>
                <p className="mt-1 text-sm text-[#596174]">🇺🇸 {locationOf(post)}</p>
                <p className="mt-1 text-sm text-[#596174]">☎ {phone}</p>
              </div>
              <div className="ml-auto h-16 w-16 rounded-[6px] bg-[#f0f0f0]" />
            </div>
            <div className="my-6 border-t border-black/10" />
            <ContactForm email={email} phone={phone} website={website} />
          </aside>
        </div>

        <StatsBar post={post} />
        <AskPanel />
        <InfoCards task={task} />
        <BodySection post={post} />
        <Specs post={post} />
        <Comps related={related} task={task} />
        <SellerBlock post={post} phone={phone} website={website} />
      </section>
    </>
  )
}

function ContactForm({ email, phone, website }: { email?: string; phone?: string; website?: string }) {
  return (
    <form className="grid gap-4">
      {['Your name *', 'Your email *', 'Your phone'].map((label) => <label key={label} className="text-xs font-black">{label}<input className="mt-2 h-12 w-full rounded-[4px] border border-black/20 px-3 text-sm outline-none focus:border-[#4777f0]" placeholder={label.includes('phone') ? '(555) 555 5555' : ''} /></label>)}
      <label className="text-xs font-black">Your message<textarea className="mt-2 h-20 w-full rounded-[4px] border border-black/20 p-3 text-sm outline-none focus:border-[#4777f0]" placeholder="Is this still available?" /></label>
      <label className="text-xs font-black">Add a note?<input className="mt-2 h-12 w-full rounded-[4px] border border-black/20 px-3 text-sm outline-none" placeholder="Share your preferred contact details" /></label>
      <div className="rounded-[4px] border border-black/10 bg-[#f8f8f8] p-3 text-sm"><span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0aa05a] font-black text-white">✓</span> Success!</div>
      <button className="h-12 rounded-[4px] bg-[#4777f0] text-sm font-black uppercase text-white">Send message</button>
      <div className="flex flex-wrap gap-2">
        {phone ? <a href={`tel:${phone}`} className="text-sm font-black text-[#4777f0]">Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="text-sm font-black text-[#4777f0]">Email</a> : null}
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="text-sm font-black text-[#4777f0]">Website</Link> : null}
      </div>
    </form>
  )
}

function StatsBar({ post }: { post: SitePost }) {
  const stats = [['🇺🇸', locationOf(post)], ['◷', '82,347 km (51,168 mi)'], ['▦', getField(post, ['condition', 'type']) || 'Manual'], ['◉', 'Original & Highly Original']]
  return (
    <div className="mt-8 flex flex-wrap items-center gap-6 rounded-[4px] bg-black px-6 py-4 text-sm font-black text-white">
      {stats.map(([icon, text]) => <span key={text} className="inline-flex items-center gap-2"><span>{icon}</span>{text}</span>)}
      <span className="ml-auto bg-white px-5 py-3 text-[#4777f0]">30 COMPS</span>
    </div>
  )
}

function AskPanel() {
  return (
    <section className="mt-8 rounded-[5px] border-2 border-[#4777f0] p-4">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-3xl font-black">Have a question? Ask Griyo <span className="text-base">●</span></h2><p className="mt-2">Get instant answers with search of listing information.</p></div><span className="rounded-full bg-black px-3 py-1 text-xs font-black text-white">beta</span></div>
      <form action="/search" className="mt-5 flex gap-3"><input name="q" placeholder="Is this listing currently for sale?" className="min-w-0 flex-1 rounded-[4px] border border-black px-4 py-3 outline-none" /><button className="rounded-[4px] bg-[#4777f0] px-6 font-black uppercase text-white">Ask Griyo</button></form>
    </section>
  )
}

function InfoCards({ task }: { task: TaskKey }) {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-[4px] border border-black/10 bg-white p-6 shadow-sm"><h3 className="text-2xl font-black">Listing Details</h3><p className="mt-3 text-sm leading-6">Comparable posts can help you understand availability, condition, and seller context.</p><button className="mt-8 h-10 w-full rounded-[4px] bg-[#4777f0] font-black uppercase text-white">Save</button></div>
      <div className="rounded-[4px] border border-black/10 bg-white p-6 shadow-sm"><h3 className="text-2xl font-black">Sell Your Listing</h3><p className="mt-3 text-sm leading-6">Price it right, then publish it for people already searching this category.</p><Link href="/contact" className="mt-8 flex h-10 items-center justify-center rounded-[4px] bg-[#05a857] font-black uppercase text-white">List it now</Link></div>
      <div className="rounded-[4px] border border-black/10 bg-white p-6 shadow-sm"><h3 className="text-2xl font-black">Explore More</h3><p className="mt-3 text-sm leading-6">Browse the full {getTaskConfig(task)?.label || 'archive'} for related public posts.</p><Link href={getTaskConfig(task)?.route || '/'} className="mt-8 flex h-10 items-center justify-center rounded-[4px] border border-[#4777f0] font-black uppercase text-[#4777f0]">View archive</Link></div>
    </section>
  )
}

function BodySection({ post }: { post: SitePost }) {
  return <section className="article-content mt-10 rounded-[5px] border border-black/10 bg-white p-6 text-base leading-8 shadow-sm" dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function Specs({ post }: { post: SitePost }) {
  const rows = [['Category', categoryOf(post, 'Classified')], ['Location', locationOf(post)], ['Seller', sellerOf(post)], ['Condition', getField(post, ['condition', 'type']) || 'Available'], ['Reference', getField(post, ['vin', 'sku', 'id']) || post.id]]
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-black">Specs</h2>
      <p className="mt-1 text-sm text-[#596174]">Details shared by the poster.</p>
      <div className="mt-5 grid rounded-[5px] border border-black/10 bg-white p-6 shadow-sm md:grid-cols-3">
        {rows.map(([label, value]) => <div key={label} className="grid grid-cols-[120px_1fr] gap-2 py-2 text-sm"><span className="text-[#596174]">{label}</span><strong>{value}</strong></div>)}
      </div>
    </section>
  )
}

function Comps({ related, task }: { related: SitePost[]; task: TaskKey }) {
  if (!related.length) return null
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-black">Comps</h2>
      <p className="mt-1 text-sm text-[#596174]">Comparable recent listings.</p>
      <div className="mt-5 grid gap-2">
        {related.slice(0, 3).map((post, index) => <RelatedRow key={post.id || post.slug} post={post} task={task} index={index} />)}
      </div>
      <Link href={getTaskConfig(task)?.route || '/'} className="mx-auto mt-6 flex w-fit items-center gap-1 text-sm font-black uppercase text-[#4777f0]">See more comps <ArrowLeft className="h-4 w-4 rotate-180" /></Link>
    </section>
  )
}

function RelatedRow({ post, task, index }: { post: SitePost; task: TaskKey; index: number }) {
  const image = getImages(post)[0] || '/placeholder.svg?height=400&width=600'
  return (
    <Link href={buildPostUrl(task, post.slug)} className={`grid rounded-[5px] border border-black/10 bg-white transition hover:bg-[#f4f7ff] md:grid-cols-[190px_1fr_160px_240px_130px] ${index === 1 ? 'bg-[#eef6ff]' : ''}`}>
      <img src={image} alt="" className="h-28 w-full object-cover" />
      <div className="p-4"><h3 className="text-base font-black text-[#4777f0]">{post.title}</h3><p className="mt-2 text-sm text-[#596174]">🇺🇸 {locationOf(post)}</p></div>
      <div className="p-4"><span className="rounded-[4px] border border-[#00a862] px-2 py-1 text-xs font-black text-[#00a862]">{index === 1 ? 'Matched' : 'Similar'}</span><p className="mt-2 font-black">{listingStatus(post)}</p></div>
      <div className="p-4 text-sm font-bold">{sellerOf(post)}<p className="font-normal text-[#596174]">Auction</p></div>
      <div className="p-4 text-sm font-bold text-[#596174]">{100 - index * 7}% Relevance</div>
    </Link>
  )
}

function SellerBlock({ post, phone, website }: { post: SitePost; phone: string; website?: string }) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-black">About this Seller</h2>
      <div className="mt-5 grid gap-6 rounded-[5px] bg-white p-8 shadow-sm md:grid-cols-[150px_1fr]">
        <div className="grid h-36 w-36 place-items-center rounded-[6px] bg-[#e9e7e5] text-center text-sm font-black uppercase">{sellerOf(post)}</div>
        <div><h3 className="text-2xl font-black">{sellerOf(post)} <CheckCircle2 className="inline h-4 w-4 fill-[#00a862] text-white" /></h3><p className="mt-3 text-sm text-[#596174]"><Phone className="inline h-4 w-4" /> {phone}</p><p className="mt-3 text-sm text-[#596174]"><MapPin className="inline h-4 w-4" /> {locationOf(post)}</p>{website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[#4777f0]"><ExternalLink className="h-4 w-4" /> {website}</Link> : null}<p className="mt-4 max-w-4xl leading-7">This seller shared a public listing with enough detail to compare price, location, and availability before making contact.</p></div>
      </div>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return <GenericDetail task="article" post={post} related={related} comments={comments} icon={FileText} label="Article" />
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  return <GenericDetail task="image" post={post} related={related} icon={Camera} label="Gallery" />
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  return <GenericDetail task="sbm" post={post} related={related} icon={Bookmark} label="Bookmark" />
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  return <GenericDetail task="pdf" post={post} related={related} icon={FileText} label="PDF" />
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  return <GenericDetail task="profile" post={post} related={related} icon={UserRound} label="Profile" />
}

function GenericDetail({ task, post, related, comments = [], icon: Icon, label }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>; icon: typeof FileText; label: string }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
      <BackLink task={task} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-[5px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#4777f0]"><Icon className="h-4 w-4" /> {label}</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">{post.title}</h1>
          {images[0] ? <img src={images[0]} alt="" className="mt-6 max-h-[560px] w-full rounded-[4px] object-cover" /> : null}
          <BodySection post={post} />
          {task === 'article' ? <EditableComments slug={post.slug} comments={comments} /> : null}
        </article>
        <aside className="space-y-4">{related.map((item, index) => <RelatedRow key={item.id || item.slug} post={item} task={task} index={index} />)}</aside>
      </div>
    </section>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[5px] border border-black/10 bg-[#f7f7f7] p-5">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5 text-[#4777f0]" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => <div key={comment.id} className="rounded-[4px] border border-black/10 bg-white p-4"><p className="text-sm font-black">{comment.name}</p><p className="mt-2 text-sm leading-6 text-[#596174]">{comment.comment}</p></div>)}
        {!comments.length ? <p className="text-sm text-[#596174]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
