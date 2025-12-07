import { execSync } from 'child_process'

export function runDoctor(cwd: string) {
  try {
    execSync(`node ./dist/index.js doctor -c ${cwd}`, {
      cwd,
      stdio: 'inherit',
    })
  } catch (e) {
    // doctor already prints errors; do not throw to avoid breaking init
  }
}
