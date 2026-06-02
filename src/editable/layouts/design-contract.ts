import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#090909',
  '--slot4-panel-bg': '#ecebea',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#5b6270',
  '--slot4-soft-muted-text': '#7d8491',
  '--slot4-accent': '#4777f0',
  '--slot4-accent-fill': '#4777f0',
  '--slot4-accent-soft': '#dce7ff',
  '--slot4-dark-bg': '#000000',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#ebe9e7',
  '--slot4-cream': '#ffffff',
  '--slot4-warm': '#f4f3f2',
  '--slot4-lavender': '#eef4ff',
  '--slot4-gray': '#f6f6f6',
  '--slot4-body-gradient': 'linear-gradient(180deg, #ffffff 0%, #ffffff 42%, #f2f1f0 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-black/10',
  darkBorder: 'border-white/15',
  shadow: 'shadow-[0_8px_22px_rgba(0,0,0,0.08)]',
  shadowStrong: 'shadow-[0_18px_50px_rgba(0,0,0,0.16)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-3 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center',
    rail: 'flex snap-x gap-2 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[360px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.16em]',
    heroTitle: 'text-5xl font-normal uppercase leading-[0.98] tracking-normal sm:text-6xl lg:text-[4.7rem]',
    sectionTitle: 'text-4xl font-normal uppercase tracking-normal sm:text-5xl',
    body: 'text-base leading-7',
  },
  surface: {
    card: `rounded-[4px] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[4px] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[4px] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-[4px] ${editablePalette.accentBg} px-5 py-3 text-sm font-black uppercase text-white transition hover:brightness-95`,
    secondary: `inline-flex items-center justify-center rounded-[4px] border border-black/20 ${editablePalette.surfaceBg} px-5 py-3 text-sm font-black uppercase ${editablePalette.surfaceText} transition hover:bg-black/[0.03]`,
    accent: `inline-flex items-center justify-center rounded-[4px] ${editablePalette.accentBg} px-5 py-3 text-sm font-black uppercase text-white transition hover:brightness-95`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[4px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.14)]',
    fade: 'transition duration-200 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Keep the classified marketplace look: black bars, white content, pale gray bands, blue actions.',
  'Use postHref() for post links so every supported route keeps working.',
  'Render missing images, summaries, prices, and categories with quiet fallbacks.',
  'Keep cards varied: hero listing, compact market rows, horizontal offers, editorial text rows, and image-first tiles.',
] as const
