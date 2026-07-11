import { Link } from 'react-router-dom'
import { SITE } from '../data/site'
import { work } from '../data/projects'
import ProjectCard from '../components/ProjectCard'

export default function Home() {
  return (
    <div>
      <section className="hero">
        <p className="hero__eyebrow">
          <span className="hero__pulse" aria-hidden="true" />
          {SITE.location} · Open to roles
        </p>
        <h1>
          I&apos;m Danny, a product designer who ships AI into{' '}
          <em>real operations</em>.
        </h1>
        <p className="hero__support">{SITE.hero.support}</p>
        <div className="experience-strip" aria-label="Recent experience">
          {SITE.experience.map((item) => (
            <div className="experience-item" key={`${item.year}-${item.org}`}>
              <span className="experience-item__year">{item.year}</span>
              <span className="experience-item__role">{item.role}</span>
              <span className="experience-item__org">{item.org}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="work-heading">
        <div className="section__head">
          <h2 id="work-heading">Selected work</h2>
          <Link to="/play">Side quests →</Link>
        </div>
        <div className="project-list">
          {work.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <h2>Building something that has to work on the floor?</h2>
          <p>
            I design and ship end to end — conversation, systems, and the
            interfaces operators actually trust.
          </p>
        </div>
        <a className="btn btn--primary" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
      </section>
    </div>
  )
}
