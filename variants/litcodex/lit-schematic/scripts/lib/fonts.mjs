// Locates fonts for rendering. Pretendard ships inside this skill folder, in assets/fonts/
// (the unmodified official variable WOFF2 under the OFL, with provenance.json), so the skill needs
// no other skill or a system install for Hangul.

import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SKILL_ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));

export function findPretendard() {
  const bundled = join(SKILL_ROOT, "assets", "fonts", "PretendardVariable.woff2");
  if (existsSync(bundled)) return { file: bundled, source: "bundled" };
  const dirs = [join(homedir(), "Library", "Fonts"), "/Library/Fonts", join(homedir(), ".local", "share", "fonts"), "/usr/share/fonts", "C:\\Windows\\Fonts"];
  for (const dir of dirs) {
    try {
      const hit = readdirSync(dir).find((name) => /^Pretendard.*\.(?:otf|ttf|woff2)$/iu.test(name));
      if (hit) return { file: join(dir, hit), source: "system" };
    } catch {
      // directory absent on this platform
    }
  }
  return null;
}
