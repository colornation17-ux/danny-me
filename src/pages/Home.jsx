import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SITE } from '../data/site'
import { featuredProjects } from '../data/featuredProjects'
import { ProjectStack } from '../components/project-cards'
import SpringWire from '../components/SpringWire'
import CareerPath from '../components/CareerPath'
import CaseStudyContact from '../components/CaseStudyContact'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  { label: 'Interaction Design', tone: 'amber', icon: 'grid' },
  { label: 'Conversational AI', tone: 'mint', icon: 'chat' },
  { label: 'User Research', tone: 'pink', icon: 'eye' },
  { label: 'Motion Design', tone: 'sky', icon: 'dots' },
]

function SkillIcon({ type }) {
  if (type === 'chat') {
    return (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <path fill="currentColor" d="M3 4h14v9H8l-5 4V4Z" />
      </svg>
    )
  }
  if (type === 'eye') {
    return (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 4c4 0 7.5 3 9 6-1.5 3-5 6-9 6s-7.5-3-9-6c1.5-3 5-6 9-6Zm0 3a3 3 0 1 0 .01 6.01A3 3 0 0 0 10 7Z"
        />
      </svg>
    )
  }
  if (type === 'dots') {
    return (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <circle cx="5" cy="10" r="2" fill="currentColor" />
        <circle cx="10" cy="7" r="2.4" fill="currentColor" />
        <circle cx="15" cy="11" r="1.8" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity=".55" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity=".55" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  )
}


export default function Home() {
  const pageRef = useRef(null)

  // Run GSAP animations once the page is visible
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [
            '.folio-hero__name--display',
            '.folio-hero__kicker',
            '.folio-hero__avail',
            '.folio-sticker',
            '.folio-hero__lead',
            '.folio-btn--contact',
            '.folio-about__body',
            '.folio-polaroid',
            '.folio-skills li',
            '.folio-work__title',
            '.folio-sticky',
            '.folio-contact__title',
            '.folio-contact__body',
            '.folio-contact__cta',
          ],
          {
            clearProps: 'all',
            autoAlpha: 1,
            opacity: 1,
            visibility: 'visible',
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
          },
        )
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // ── Hero sequence ────────────────────────────────────────────────
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        // Split display name into characters and stagger them in
        const nameEl = document.querySelector('.folio-hero__name--display')
        if (nameEl) {
          const raw = nameEl.textContent.trim()
          nameEl.innerHTML = raw
            .split('')
            .map((c) => `<span class="gs-char" style="display:inline-block">${c}</span>`)
            .join('')
          tl.from('.folio-hero__name--display .gs-char', {
            opacity: 0,
            y: 48,
            rotateX: -80,
            transformOrigin: '50% 100%',
            stagger: 0.04,
            duration: 0.55,
          })
        }

        tl.from(
          '.folio-hero__kicker',
          { opacity: 0, x: -20, duration: 0.4 },
          '<+0.1',
        )
          .from(
            '.folio-hero__avail',
            { opacity: 0, y: 12, duration: 0.35 },
            '-=0.2',
          )
          .from(
            '.folio-sticker',
            {
              opacity: 0,
              scale: 0.6,
              rotation: -20,
              stagger: 0.08,
              duration: 0.45,
              ease: 'back.out(2)',
            },
            '-=0.25',
          )
          .from(
            '.folio-hero__lead',
            { opacity: 0, y: 18, duration: 0.4 },
            '-=0.15',
          )
          .from(
            '.folio-btn--contact',
            { opacity: 0, scale: 0.88, duration: 0.35, ease: 'back.out(1.7)' },
            '-=0.1',
          )

        // ── About section — safe reveal (same pin/refresh hazard as contact) ──
        const aboutBody = document.querySelector('.folio-about__body')
        if (aboutBody) {
          const revealAbout = () => {
            gsap.to(aboutBody, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto',
              clearProps: 'transform',
            })
          }
          gsap.set(aboutBody, { autoAlpha: 0, y: 28 })
          ScrollTrigger.create({
            trigger: '.folio-about',
            start: 'top 78%',
            once: true,
            invalidateOnRefresh: true,
            onEnter: revealAbout,
            onRefresh(self) {
              if (self.progress > 0 || self.isActive) revealAbout()
            },
          })
        }
        const polaroids = gsap.utils.toArray('.folio-polaroid')
        if (polaroids.length) {
          const revealPolaroids = () => {
            gsap.to(polaroids, {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              duration: 0.55,
              stagger: 0.12,
              ease: 'back.out(1.4)',
              overwrite: 'auto',
              clearProps: 'transform',
            })
          }
          gsap.set(polaroids, { autoAlpha: 0, y: 24, rotation: 4 })
          ScrollTrigger.create({
            trigger: '.folio-about__grid',
            start: 'top 80%',
            once: true,
            invalidateOnRefresh: true,
            onEnter: revealPolaroids,
            onRefresh(self) {
              if (self.progress > 0 || self.isActive) revealPolaroids()
            },
          })
        }
        // ── Skills — safe reveal (folder stack height used to strand gsap.from) ──
        const skillEls = gsap.utils.toArray('.folio-skills li')
        if (skillEls.length) {
          const revealSkills = () => {
            gsap.to(skillEls, {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: 'back.out(1.4)',
              overwrite: 'auto',
              clearProps: 'transform',
            })
          }
          gsap.set(skillEls, { autoAlpha: 0, y: 28, rotation: 0 })
          ScrollTrigger.create({
            trigger: '.folio-skills',
            start: 'top 88%',
            once: true,
            invalidateOnRefresh: true,
            onEnter: revealSkills,
            onRefresh(self) {
              if (self.progress > 0 || self.isActive) revealSkills()
            },
          })
        }

        // ── Work heading ────────────────────────────────────────────────
        const workTitle = document.querySelector('.folio-work__title')
        const workSticky = document.querySelector('.folio-sticky')
        const revealWorkHead = () => {
          if (workTitle) {
            gsap.to(workTitle, {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
              clearProps: 'transform',
            })
          }
          if (workSticky) {
            gsap.to(workSticky, {
              autoAlpha: 1,
              y: 0,
              duration: 0.4,
              delay: 0.08,
              ease: 'power2.out',
              overwrite: 'auto',
              clearProps: 'transform',
            })
          }
        }
        if (workTitle) gsap.set(workTitle, { autoAlpha: 0, y: 24 })
        if (workSticky) gsap.set(workSticky, { autoAlpha: 0, y: 12 })
        if (workTitle || workSticky) {
          ScrollTrigger.create({
            trigger: '.folio-work__head',
            start: 'top 85%',
            once: true,
            invalidateOnRefresh: true,
            onEnter: revealWorkHead,
            onRefresh(self) {
              if (self.progress > 0 || self.isActive) revealWorkHead()
            },
          })
        }

        // ── Contact section ─────────────────────────────────────────────
        // Do not use gsap.from({ opacity: 0 }) here. ProjectStack pin/refresh
        // can prevent the tween from playing and leave the copy invisible
        // (eyebrow + CTA visible, headline/body gone). Animate only on enter
        // and force-visible if the section is already past the start line.
        const contactEls = gsap.utils.toArray(
          '.folio-contact__title, .folio-contact__body, .folio-contact__cta',
        )
        if (contactEls.length) {
          const revealContact = () => {
            gsap.to(contactEls, {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.08,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }
          gsap.set(contactEls, { autoAlpha: 0, y: 20 })
          ScrollTrigger.create({
            trigger: '.folio-contact',
            start: 'top 90%',
            once: true,
            invalidateOnRefresh: true,
            onEnter: revealContact,
            onRefresh(self) {
              if (self.progress > 0 || self.isActive) revealContact()
            },
          })
        }

        // ── Hero stickers + DANNY box ────────────────────────────────────
        const stickers = gsap.utils.toArray('.folio-sticker')
        stickers.forEach((el, i) => {
          const baseRot =
            parseFloat(getComputedStyle(el).getPropertyValue('--rot')) || 0
          gsap.set(el, {
            rotation: baseRot,
            x: 0,
            y: 0,
            transformOrigin: '50% 50%',
          })
          const dir = i % 2 === 0 ? 1 : -1
          gsap.to(el, {
            y: `+=${10 + (i % 3) * 5}`,
            x: `+=${dir * (8 + i * 3)}`,
            rotation: baseRot + dir * 2.2,
            duration: 2.6 + i * 0.4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 1.15 + i * 0.28,
          })
        })

        const mouseMm = gsap.matchMedia()
        mouseMm.add('(hover: hover) and (pointer: fine)', () => {
          const select = document.querySelector('.folio-hero__select')
          if (select) {
            const xTo = gsap.quickTo(select, 'x', { duration: 0.4, ease: 'power2.out' })
            const yTo = gsap.quickTo(select, 'y', { duration: 0.4, ease: 'power2.out' })
            const rotTo = gsap.quickTo(select, 'rotation', {
              duration: 0.4,
              ease: 'power2.out',
            })
            const onMove = (e) => {
              const r = select.getBoundingClientRect()
              const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
              const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
              xTo(nx * 8)
              yTo(ny * 5)
              rotTo(nx * 1.6)
            }
            const onLeave = () => {
              gsap.to(select, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.65,
                ease: 'elastic.out(1, 0.45)',
                overwrite: 'auto',
              })
            }
            select.addEventListener('mousemove', onMove)
            select.addEventListener('mouseleave', onLeave)
            return () => {
              select.removeEventListener('mousemove', onMove)
              select.removeEventListener('mouseleave', onLeave)
            }
          }
          return undefined
        })

        // ── Magnetic hover on the hero CTA ──────────────────────────────
        const cta = document.querySelector('.folio-btn--contact')
        if (cta) {
          const xTo = gsap.quickTo(cta, 'x', { duration: 0.22, ease: 'power3.out' })
          const yTo = gsap.quickTo(cta, 'y', { duration: 0.22, ease: 'power3.out' })
          const onMove = (e) => {
            const r = cta.getBoundingClientRect()
            const cx = r.left + r.width / 2
            const cy = r.top + r.height / 2
            xTo((e.clientX - cx) * 0.25)
            yTo((e.clientY - cy) * 0.25)
          }
          const onLeave = () => {
            gsap.to(cta, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: 'elastic.out(1, 0.4)',
              overwrite: 'auto',
            })
          }
          cta.addEventListener('mousemove', onMove)
          cta.addEventListener('mouseleave', onLeave)
          return () => {
            mouseMm.revert()
            cta.removeEventListener('mousemove', onMove)
            cta.removeEventListener('mouseleave', onLeave)
          }
        }

        return () => mouseMm.revert()
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="folio folio--rich folio--fullgrid" ref={pageRef}>
      <section className="folio-hero folio-hero--canvas" id="home" aria-labelledby="folio-name">
        <p className="folio-hero__kicker folio-hero__kicker--script">my name is</p>

        <div className="folio-hero__select">
          <h1 id="folio-name" className="folio-hero__name folio-hero__name--display">
            Danny
          </h1>
        </div>

        <p className="folio-hero__avail folio-hero__avail--dot">
          <span className="folio-dot" aria-hidden="true" />
          <span className="folio-hero__avail-text">
            Open to full-time product design roles
          </span>
        </p>

        <div className="folio-sticker folio-sticker--green" style={{ '--rot': '14deg' }}>
          Currently shipping AI for La Bodega
        </div>
        <div className="folio-sticker folio-sticker--yellow" style={{ '--rot': '-8deg' }}>
          Previously CODE19 Racing · IU HCI
        </div>
        <div className="folio-sticker folio-sticker--amber folio-sticker--pill" style={{ '--rot': '-3deg' }}>
          Product Designer
        </div>
        <div className="folio-sticker folio-sticker--pink folio-sticker--pill" style={{ '--rot': '3deg' }}>
          Indianapolis / Georgia
        </div>

        <p className="folio-hero__lead folio-hero__lead--center">
          A product designer who ships AI into <em className="folio-lead__impact">real operations</em>
        </p>

        <a className="folio-btn folio-btn--contact" href="#projects">
          <span className="folio-btn__arrow-down" aria-hidden="true">↓</span>{' '}
          See my work
        </a>
      </section>

      <SpringWire className="folio-spring" seed={2} radio invite />

      <section className="folio-about" id="about" aria-labelledby="about-hello-heading">

        <h2 className="folio-about__hello" id="about-hello-heading">Hello World</h2>

        <p className="folio-about__body folio-about__body--lead folio-about__body--handwritten">
          Hi, I&apos;m Danny, a product designer working between Indianapolis and
          Georgia. I translate complex problem spaces into clear, useful experiences
          that bridge customer needs and business goals across conversational AI,
          retail operations, mobility, and high-performance interfaces.
        </p>

        <CareerPath />

        <ul className="folio-skills folio-skills--rich">
          {SKILLS.map((skill) => (
            <li key={skill.label} data-tone={skill.tone}>
              <span>{skill.label}</span>
              <span className="folio-skills__icon">
                <SkillIcon type={skill.icon} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <SpringWire className="folio-spring" seed={5} radio />

      <section
        className="folio-work folio-work--folders"
        id="projects"
        tabIndex={-1}
        aria-labelledby="work-heading"
      >
        <div className="folio-work__head">
          <h2 id="work-heading" className="folio-work__title folio-work__title--block">
            Featured work
          </h2>
          <p className="folio-sticky">
            Four shipped systems from live ops, then two automotive concepts.
          </p>
        </div>

        <ProjectStack projects={featuredProjects} />
      </section>

      {/* ── Recommendations ─────────────────────────────────────────── */}
      <section className="folio-recs" aria-label="Recommendations">
        <p className="folio-recs__label">What people say</p>
        <div className="folio-recs__grid">

          <article className="rec-card">
            <div className="rec-card__header">
              <div className="rec-card__avatar">
                <img
                  src="/recs/lawrence-walter.png"
                  alt="Lawrence Walter"
                />
              </div>
              <div className="rec-card__meta">
                <strong className="rec-card__name">Lawrence Walter</strong>
                <span className="rec-card__role">CEO · Code19 Racing</span>
              </div>
              {/* LinkedIn bird */}
              <span className="rec-card__source" aria-label="LinkedIn">
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <path fill="#0077B5" d="M4.5 6.5h-3v9h3v-9Zm-1.5-4a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 3 2.5ZM7 15.5h3v-5c0-1.1.9-2 2-2s2 .9 2 2v5h3v-5.5a4.5 4.5 0 0 0-4.5-4.5c-1.3 0-2.4.6-3.1 1.5H9.1L9 6.5H7v9Z"/>
                </svg>
              </span>
            </div>

            <div className="rec-card__body">
              <blockquote className="rec-card__quote">
                Danny brought a rare blend of <em>creative vision and methodical design thinking</em>, ensuring every interface decision was grounded in user insights. His expertise in <em>UX research, interaction design, and usability testing</em> played a pivotal role in shaping both our website and our AI-driven fan experience.
              </blockquote>

              <div className="rec-card__source-bar">
                <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true">
                  <path fill="#0077B5" d="M4.5 6.5h-3v9h3v-9Zm-1.5-4a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 3 2.5ZM7 15.5h3v-5c0-1.1.9-2 2-2s2 .9 2 2v5h3v-5.5a4.5 4.5 0 0 0-4.5-4.5c-1.3 0-2.4.6-3.1 1.5H9.1L9 6.5H7v9Z"/>
                </svg>
                LinkedIn recommendation
              </div>
            </div>
          </article>

        </div>
      </section>

      <CaseStudyContact />

    </div>
  )
}
