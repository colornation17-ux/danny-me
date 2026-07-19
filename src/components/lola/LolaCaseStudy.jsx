import { PrologueHook } from '../../lola-case-study/case-study/acts/PrologueHook'
import { PhaseDefine } from '../../lola-case-study/case-study/acts/PhaseDefine'
import { PhaseDiscover } from '../../lola-case-study/case-study/acts/PhaseDiscover'
import { PhaseDevelop } from '../../lola-case-study/case-study/acts/PhaseDevelop'
import { PhaseDeliver } from '../../lola-case-study/case-study/acts/PhaseDeliver'
import CaseStudyContact from '../CaseStudyContact'
import '../../lola-case-study/styles/portfolio-entry.css'

/** Folio CaseStudyNav steps — ids match PhaseShell / prologue anchors */
export const LOLA_RAIL_STEPS = [
  { id: 'prologue', num: '00', label: 'Intro' },
  { id: 'discover', num: '01', label: 'Discover' },
  { id: 'define', num: '02', label: 'Define' },
  { id: 'develop', num: '03', label: 'Develop' },
  { id: 'deliver', num: '04', label: 'Deliver' },
  { id: 'contact', num: '05', label: 'Contact' },
]

/**
 * Full Lola interactive case study body (from la-bodega-lola), rendered on-site.
 * Folio CaseStudyNav / Nav / Footer / SiteRadio live in Project.jsx + App.jsx.
 */
export default function LolaCaseStudy() {
  return (
    <div className="lola-cs">
      <div className="cs-skip-links">
        <a href="#develop/flows/broadcast" className="cs-skip-link">
          Skip to flows
        </a>
        <a href="#discover" className="cs-skip-link">
          Skip to phases
        </a>
      </div>
      <div id="lola-phases">
        <PrologueHook />
        <PhaseDiscover />
        <PhaseDefine />
        <PhaseDevelop />
        <PhaseDeliver />
        <CaseStudyContact />
      </div>
    </div>
  )
}
