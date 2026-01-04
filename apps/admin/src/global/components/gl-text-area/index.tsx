import type { TextareaProps } from 'tdesign-react'

export const GlTextArea = (props: TextareaProps) => {
  const { t } = useTranslation()

  const { className, placeholder = t('component.input.placeholder'), ...rest } = props
  return (
    <Textarea
      className={`gl-text-areat ${className ?? ''}`}
      placeholder={placeholder}
      {...rest}
    ></Textarea>
  )
}
