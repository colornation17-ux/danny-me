import { Link } from 'react-router-dom'
import { Theme } from '@astryxdesign/core/theme'
import { LinkProvider } from '@astryxdesign/core/Link'
import { neutralTheme } from '@astryxdesign/theme-neutral'

/**
 * Astryx design system theme + router Link bridge.
 * Use `@astryxdesign/core/*` components inside this tree.
 *
 * Note: prefer `@astryxdesign/theme-neutral` over `/built` —
 * the built entry currently fails Vite ESM resolution for `./icons`.
 */
export default function AstryxProvider({ children }) {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={Link}>{children}</LinkProvider>
    </Theme>
  )
}
