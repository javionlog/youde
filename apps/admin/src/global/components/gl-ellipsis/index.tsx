import type { ReactNode } from 'react'
import type { TooltipProps } from 'tdesign-react'

interface Props extends StyledProps, TooltipProps {
  children?: ReactNode
}

export const GlEllipsis = (props: Props) => {
  const { className, style, children, content, ...tooltipProps } = props

  const outerRef = useRef<HTMLDivElement>(null)
  const [disabled, setDisabled] = useState(true)

  const onSetDisabled = () => {
    const scrollWidth = outerRef.current?.scrollWidth ?? 0
    const offsetWidth = outerRef.current?.offsetWidth ?? 0
    const isOverflow = scrollWidth > offsetWidth
    setDisabled(!isOverflow)
  }

  useEffect(() => {
    onSetDisabled()
  }, [children, content])

  return (
    <Tooltip content={disabled ? null : (content ?? children)} {...tooltipProps}>
      <div
        ref={outerRef}
        className={`gl-ellipsis overflow-hidden overflow-ellipsis whitespace-nowrap ${className ?? ''}`}
        style={style}
        onMouseEnter={onSetDisabled}
        onClick={onSetDisabled}
      >
        {children}
      </div>
    </Tooltip>
  )
}
