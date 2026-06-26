import { execSync } from "node:child_process"
import { chmodSync, mkdirSync, writeFileSync, unlinkSync } from "node:fs"
import { extname, join } from "node:path"
import { getConfigDir } from "./paths.js"

const ASSETS = {
  "darwin-arm64": "rtk-aarch64-apple-darwin.tar.gz",
  "darwin-x64": "rtk-x86_64-apple-darwin.tar.gz",
  "linux-x64": "rtk-x86_64-unknown-linux-musl.tar.gz",
  "linux-arm64": "rtk-aarch64-unknown-linux-gnu.tar.gz",
  "win32-x64": "rtk-x86_64-pc-windows-msvc.zip",
}

function platformAsset() {
  const key = `${process.platform}-${process.arch}`
  return ASSETS[key] ?? null
}

function alreadyInstalled() {
  try {
    execSync("which rtk", { stdio: "ignore", shell: true })
    return true
  } catch {
    return false
  }
}

function extract(archivePath, destDir) {
  const isZip = extname(archivePath) === ".zip"

  if (isZip && process.platform === "win32") {
    execSync(
      `powershell -Command "Expand-Archive -Path '${archivePath}' -DestinationPath '${destDir}' -Force"`,
      { stdio: "ignore", shell: true },
    )
  } else {
    execSync(`tar -xzf "${archivePath}" -C "${destDir}"`, {
      stdio: "ignore",
      shell: true,
    })
  }
}

export async function installSqueeze() {
  if (alreadyInstalled()) return

  const asset = platformAsset()
  if (!asset) {
    console.warn("⚠ Squeeze: unsupported platform — install rtk manually")
    return
  }

  const binDir = join(getConfigDir(), "bin")
  mkdirSync(binDir, { recursive: true })

  const url = `https://github.com/rtk-ai/rtk/releases/latest/download/${asset}`
  const archivePath = join(binDir, asset)

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const buffer = Buffer.from(await response.arrayBuffer())
    writeFileSync(archivePath, buffer)

    extract(archivePath, binDir)

    try { unlinkSync(archivePath) } catch {}

    if (process.platform !== "win32") {
      chmodSync(join(binDir, "rtk"), 0o755)
    }
  } catch {
    try { unlinkSync(archivePath) } catch {}
    console.warn("⚠ Squeeze: download failed — install rtk manually")
  }
}
