import Image from 'next/image'
import Link from 'next/link'

import CopyLayout from '@/components/copy-layout'

interface CardProps {
  card: {
    id: number
    title: string
    demoUrl?: string
    repoUrl?: string
    cmd?: string
    imgHeight: number
  }
}

export default function Card({ card }: CardProps) {
  return (
    <article>
      <figure className="relative -m-px rounded-2xl border border-border/60 bg-card/80 p-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.3)]">
        <Image
          className="rounded-xl"
          src={`/layouts/app-${card.id}.png`}
          alt={card.title}
          width={1120}
          height={card.imgHeight}
        />
      </figure>
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-sm font-medium">{card.title}</h2>
        {card.demoUrl && card.repoUrl ? (
          <div className="flex items-center gap-6">
            <CopyLayout command={card.cmd} />
            <Link
              href={card.demoUrl}
              className="inline-flex items-center gap-1 text-sm hover:underline"
              target="_blank"
            >
              Live Demo
              <span className="text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.37 6.486 6.356 1.11H1.008L2.058.06H7.42v5.376l-1.05 1.05ZM.336 6.374 6.538.172l.77.77-6.202 6.202-.77-.77Z" />
                </svg>
              </span>
            </Link>
            <Link
              href={card.repoUrl}
              className="inline-flex items-center gap-1 text-sm hover:underline"
              target="_blank"
            >
              GitHub
              <span className="text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.37 6.486 6.356 1.11H1.008L2.058.06H7.42v5.376l-1.05 1.05ZM.336 6.374 6.538.172l.77.77-6.202 6.202-.77-.77Z" />
                </svg>
              </span>
            </Link>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Code soon</span>
        )}
      </div>
    </article>
  )
}
