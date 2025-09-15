import type { ReactNode } from 'react'
import type { TooltipProps } from 'tdesign-react'

interface Props extends StyledProps, TooltipProps {
  children?: ReactNode
}

export const GlEllipsis = (props: Props) => {
  const { className, style, children, ...tooltipProps } = props

  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const [disabled, setDisabled] = useState(true)
  const onMouseEnter = () => {
    const outerWidth = outerRef.current?.getBoundingClientRect().width ?? 0
    const innerWidth = innerRef.current?.getBoundingClientRect().width ?? 0
    const isOverflow = innerWidth <= outerWidth
    setDisabled(isOverflow)
  }
  return (
    <Tooltip disabled={disabled} {...tooltipProps}>
      <div
        ref={outerRef}
        className={`overflow-hidden overflow-ellipsis whitespace-nowrap ${className}`}
        style={style}
        onMouseEnter={onMouseEnter}
        onClick={onMouseEnter}
      >
        <span ref={innerRef}>{children}</span>
      </div>
    </Tooltip>
  )
}
