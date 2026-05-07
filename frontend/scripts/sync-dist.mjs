import { cp, rm, mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendRoot = path.resolve(__dirname, "..")
const workspaceRoot = path.resolve(frontendRoot, "..")
const sourceDir = path.join(frontendRoot, "out")
const frontendDistDir = path.join(frontendRoot, "dist")
const backendDistDir = path.join(workspaceRoot, "backend", "dist")

async function syncDirectory(source, destination) {
  await rm(destination, { recursive: true, force: true })
  await mkdir(destination, { recursive: true })
  await cp(source, destination, { recursive: true })
}

try {
  await syncDirectory(sourceDir, frontendDistDir)
  await syncDirectory(sourceDir, backendDistDir)
  console.log(`Synced export from ${sourceDir} to ${frontendDistDir} and ${backendDistDir}`)
} catch (error) {
  console.error(error)
  process.exit(1)
}