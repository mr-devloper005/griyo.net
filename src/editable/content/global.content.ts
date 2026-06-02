import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Local classifieds and market guides',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'FOLLOW THE MARKET',
    primaryLinks: [
      { label: 'Find', href: '/classified' },
      { label: 'Price', href: '/listings' },
      { label: 'Sell', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Search listings', href: '/classified' },
      secondary: { label: 'List an item', href: '/contact' },
    },
  },
  footer: {
    tagline: 'CLASSIFIED GARAGE',
    description: 'Useful listings, local market notes, and practical resources for people comparing deals, services, property, jobs, vehicles, and second-hand finds.',
    columns: [
      {
        title: 'Classifieds',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Markets', href: '/classified' },
          { label: 'Listings', href: '/listings' },
          { label: 'Blog', href: '/article' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About us', href: '/about' },
          { label: 'Data sources', href: '/pdf' },
          { label: 'Sell your item', href: '/contact' },
          { label: 'Help center', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Company names, images, and post details belong to their respective owners or submitters.',
  },
  commonLabels: {
    readMore: 'View listing',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Posted',
  },
} as const
