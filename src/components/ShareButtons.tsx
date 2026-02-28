'use client'
export default function ShareButtons({ title }: { title: string }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>Share:</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener" className="hover:text-primary">𝕏</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener" className="hover:text-primary">f</a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener" className="hover:text-primary">in</a>
    </div>
  )
}
