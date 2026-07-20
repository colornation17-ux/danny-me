type Props = {
  id: string
  indexLabel: string
  tabLabel: string
  isActive: boolean
  showIndent: boolean
  onActivate: () => void
}

export default function ProjectSelector({
  id,
  indexLabel,
  tabLabel,
  isActive,
  showIndent,
  onActivate,
}: Props) {
  const triggerId = `project-trigger-${id}`
  const panelId = `project-panel-${id}`

  return (
    <div className="folder-card__chrome">
      {showIndent && (
        <div className="folder-card__indent" aria-hidden="true" />
      )}
      <button
        type="button"
        id={triggerId}
        className="folder-card__tab"
        aria-expanded={isActive}
        aria-controls={panelId}
        onClick={onActivate}
      >
        <span className="folder-card__tab-num" aria-hidden="true">
          {indexLabel}
        </span>
        <span className="folder-card__tab-label">{tabLabel}</span>
      </button>
      <div className="folder-card__tab-slope" aria-hidden="true" />
      <div className="folder-card__ledge" aria-hidden="true" />
    </div>
  )
}
