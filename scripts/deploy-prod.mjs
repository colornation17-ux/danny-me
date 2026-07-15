#!/usr/bin/env node
/**
 * Production CLI deploy (works with private or public GitHub).
 * Prefer `npm run deploy:prod` after push so local audio (gitignored) is included.
 * Pulls Vercel settings → builds locally → uploads prebuilt → waits for Ready.
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const PROD = 'https://danny-me-rho.vercel.app'
const POLL_MS = 4000
const MAX_WAIT_MS = 3 * 60 * 1000

function runCapture(args) {
  const result = spawnSync(npx, args, {
    cwd: root,
    encoding: 'utf8',
    shell: true,
    env: process.env,
  })
  return {
    status: result.status ?? 1,
    stdout: `${result.stdout || ''}${result.stderr || ''}`,
  }
}

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

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function extractUrl(text) {
  const match = text.match(/https:\/\/danny-[a-z0-9-]+\.vercel\.app/i)
  return match?.[0] || null
}

function inspectStatus(url) {
  const { stdout } = runCapture(['vercel', 'inspect', url])
  // Output looks like: "status  ● Ready" — ignore the bullet glyph
  const match = stdout.match(/status[^\w]*(Ready|Error|Canceled|Building|Queued|UNKNOWN)/i)
  return match?.[1] || 'UNKNOWN'
}

run(['vercel', 'pull', '--yes', '--environment=production'], 'Pull project settings')
run(['vercel', 'build', '--prod'], 'Build for production')

if (!existsSync(path.join(root, '.vercel', 'output'))) {
  console.error('\n✗ Missing .vercel/output after build')
  process.exit(1)
}

console.log('\n→ Deploy prebuilt to production')
const deploy = runCapture([
  'vercel',
  'deploy',
  '--prebuilt',
  '--prod',
  '-y',
  '--no-wait',
])
if (deploy.status !== 0) {
  console.error(deploy.stdout)
  console.error('\n✗ Deploy failed')
  process.exit(deploy.status)
}

const url = extractUrl(deploy.stdout)
if (!url) {
  console.error(deploy.stdout)
  console.error('\n✗ Could not parse deployment URL')
  process.exit(1)
}

console.log(`  Uploaded: ${url}`)
console.log('  Waiting for Ready…')

const started = Date.now()
let status = 'UNKNOWN'
while (Date.now() - started < MAX_WAIT_MS) {
  sleep(POLL_MS)
  status = inspectStatus(url)
  process.stdout.write(`  ${status}\r`)
  if (status === 'Ready' || status === 'Error' || status === 'Canceled') break
}

console.log(`  ${status}`)

if (status !== 'Ready') {
  console.error(
    `\n✗ Deployment did not become Ready (status: ${status}). Check ${url}`,
  )
  process.exit(1)
}

console.log(`\n✓ Live — ${PROD}`)
console.log(`  Deployment: ${url}`)
