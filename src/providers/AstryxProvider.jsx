/**
 * Opt-in Astryx island wrapper — do NOT wrap the whole portfolio.
 * Astryx theme uses `light-dark(#171717, #fafafa)` for text; on OS dark mode
 * that resolves to near-white and wipes hero/"product designer" ink on light UI.
 *
 * Usage (local surface only):
 *   import AstryxProvider from './providers/AstryxProvider'
 *   import '@astryxdesign/core/reset.css'
 *   import '@astryxdesign/core/astryx.css'
 *   import '@astryxdesign/theme-neutral/theme.css'
 *   <AstryxProvider>…Astryx components…</AstryxProvider>
 */
import { Link } from 'react-router-dom'
import { Theme } from '@astryxdesign/core/theme'
import { LinkProvider } from '@astryxdesign/core/Link'
import { neutralTheme } from '@astryxdesign/theme-neutral'

export default function AstryxProvider({ children }) {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={Link}>{children}</LinkProvider>
    </Theme>
  )
}
