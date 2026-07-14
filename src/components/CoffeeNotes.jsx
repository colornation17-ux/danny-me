const BASICS_ITEMS = [
  'Lavazza Super Crema',
  'Lavazza Espresso',
  'Drip · Espresso · Oat Latte',
  'Planet Oat · Oatly · Chobani',
  'No syrup, sometimes maple',
]

const TRENDING_ITEMS = [
  'Banana Cold Foam Cold Brew',
  'Iced Oat Latte',
  'Iced Americano',
]

export default function CoffeeNotes() {
  return (
    <div className="coffee-notes">
      <div className="sticky-note sticky-note--basics">
        <span className="sticky-note__tape" />
        <h3 className="sticky-note__heading">Coffee Basics ☕</h3>
        <ul className="sticky-note__list">
          {BASICS_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="sticky-note sticky-note--trending">
        <span className="sticky-note__tape" />
        <h3 className="sticky-note__heading">Trending in My Kitchen ✦</h3>
        <ul className="sticky-note__list">
          {TRENDING_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="sticky-note__footer">Small experiments, one cup at a time.</p>
      </div>
    </div>
  )
}
