export default function LolaMotion() {
  return (
    <div className="lola-motion" aria-hidden="true">
      <div className="lola-motion__phone">
        <div className="lola-motion__status">
          <span>9:41</span>
          <span className="lola-motion__signal" />
        </div>
        <header className="lola-motion__header">
          <span className="lola-motion__back">‹</span>
          <div className="lola-motion__avatar">L</div>
          <div>
            <div className="lola-motion__name">Lola · La Bodega</div>
            <div className="lola-motion__sub">online</div>
          </div>
        </header>

        <div className="lola-motion__thread">
          <div className="lola-motion__flyer">
            <div className="lola-motion__flyer-art" />
            <span>Weekly specials · Jun 6–7</span>
          </div>

          <div className="lola-motion__bubble lola-motion__bubble--in lola-motion__bubble--1">
            <p>
              Hi María! I&apos;m Lola. Tap below or ask in English or Spanish.
            </p>
            <time>9:12 AM</time>
          </div>

          <div className="lola-motion__buttons lola-motion__buttons--1">
            <span>See specials</span>
            <span>Place pickup</span>
            <span>Reminders</span>
          </div>

          <div className="lola-motion__bubble lola-motion__bubble--out lola-motion__bubble--2">
            <p>¿Tienen pechuga sin hueso?</p>
            <time>9:13 AM</time>
          </div>

          <div className="lola-motion__bubble lola-motion__bubble--in lola-motion__bubble--3">
            <p>
              Sí, pechuga sin hueso <strong>$1.99/lb</strong> esta semana. ¿La
              agrego a tu lista?
            </p>
            <time>9:13 AM</time>
          </div>

          <div className="lola-motion__bubble lola-motion__bubble--out lola-motion__bubble--4">
            <p className="lola-motion__voice">
              <span className="lola-motion__wave" />
              0:08 voice note
            </p>
            <time>9:14 AM</time>
          </div>

          <div className="lola-motion__staff">
            <span className="lola-motion__staff-ping" />
            Connect · Orders · draft buzz → confirm
          </div>
        </div>
      </div>
    </div>
  )
}
