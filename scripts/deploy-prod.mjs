#!/usr/bin/env node
/**
 * Production deploy while the GitHub repo stays private (Hobby-friendly).
 * Pulls Vercel settings → builds locally → uploads prebuilt → aliases prod.
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'

function run(args, label) {
  console.log(`\n→ ${label}`)
  const result = spawnSync(npx, args, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  })
  if (result.status !== 0) {
    console.error(`\n✗ ${label} failed (exit ${result.status ?? 1})`)
    process.exit(result.status ?? 1)
  }
}

run(['vercel', 'pull', '--yes', '--environment=production'], 'Pull project settings')
run(['vercel', 'build', '--prod'], 'Build for production')

if (!existsSync(path.join(root, '.vercel', 'output'))) {
  console.error('\n✗ Missing .vercel/output after build')
  process.exit(1)
}

run(['vercel', 'deploy', '--prebuilt', '--prod', '-y'], 'Deploy prebuilt to production')
console.log('\n✓ Live — https://danny-me-rho.vercel.app')
