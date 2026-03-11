import React, {
  MouseEventHandler,
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactPortal,
} from 'react'
import { createPortal } from 'react-dom'

import template from '../template/index'

interface Props {
  children: React.ReactNode
  dir?: string
  srcDoc?: string
}

const Viewport = ({ children, dir, srcDoc = template, ...props }: Props) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [compContent, setCompContent] = useState<ReactPortal | null>(null)
  const [pressure, setPressure] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const iframe = useRef<HTMLIFrameElement>(null)
  const iframeContainerRef = useRef<HTMLDivElement>(null)

  const handleEvent: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const releaseDrag = useCallback(() => {
    setPressure(false)
    if (iframeContainerRef.current) {
      iframeContainerRef.current.classList.remove('pointer-events-none')
    }
    if (containerRef.current) {
      containerRef.current.style.cursor = ''
    }
  }, [])

  const mouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    handleEvent(e)
    releaseDrag()
  }

  useEffect(() => {
    document.addEventListener('mouseup', releaseDrag)
    const timer = setTimeout(() => {
      const iframeEl = iframe.current as HTMLIFrameElement | null
      const iframeDc = iframeEl?.contentWindow?.document
      if (iframeDc?.body) {
        setCompContent(createPortal(children, iframeDc.body))
        setLoaded(true)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseup', releaseDrag)
    }
  }, [children, releaseDrag])

  useEffect(() => {
    const checkAndHandleH = (iframeDc: Document | undefined) => {
      if (iframeDc && iframeDc.body && iframeDc.body.childNodes[1]) {
        handleIframeHeight()
      }
    }

    if (loaded) {
      const iframeEl = iframe.current as HTMLIFrameElement
      const iframeDc = iframeEl?.contentWindow?.document
      checkAndHandleH(iframeDc)

      const intervalId = setInterval(() => {
        checkAndHandleH(iframeDc)
      }, 100)

      return () => clearInterval(intervalId)
    }
  }, [loaded, dir, children])

  const handleIframeHeight = () => {
    const iframeEl = iframe.current as HTMLIFrameElement
    const iframeHeight = iframeEl?.contentWindow?.document?.body?.scrollHeight
    if (iframeEl && iframeEl.style) iframeEl.style.height = `${iframeHeight}px`
  }

  const mouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    handleEvent(e)
    setPressure(true)
    iframeContainerRef?.current?.classList.add('pointer-events-none')
    const containerRefEl = containerRef.current as HTMLDivElement
    containerRefEl.style.cursor = 'ew-resize'
  }

  const mouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    handleEvent(e)
    const x = e.clientX - e.currentTarget.getBoundingClientRect().x
    const containerW = (containerRef.current as HTMLDivElement).getBoundingClientRect().width
    if (pressure && x >= 400) {
      ;(iframeContainerRef.current as HTMLIFrameElement).style.width =
        x + 2 >= containerW ? '100%' : `${x}px`
      handleIframeHeight()
    }
  }

  const touchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    const containerW = (containerRef.current as HTMLDivElement).getBoundingClientRect()
    const pageX = e.targetTouches[0].pageX - containerW.x

    if (pageX >= 400) {
      ;(iframeContainerRef.current as HTMLIFrameElement).style.width = `${pageX}px`
      handleIframeHeight()
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.22)]"
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onTouchMove={touchMove}
    >
      <div
        ref={iframeContainerRef}
        className="relative h-auto max-w-full min-w-full sm:flex sm:min-w-[400px]"
      >
        <iframe
          srcDoc={template}
          ref={iframe}
          className="iframes mr-4 min-h-[300px] w-full appearance-none bg-white"
          id="iframe"
          loading="lazy"
        >
          {compContent}
        </iframe>
        <div
          className="absolute top-0 right-0 hidden h-full w-6 items-center border-l border-border/60 bg-muted/60 sm:flex"
          style={{ cursor: 'ew-resize' }}
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 rotate-90 transform text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Viewport
