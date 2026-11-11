import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const skill = readFileSync(new URL("./SKILL.md", import.meta.url), "utf8");
const bashBlocks = [...skill.matchAll(/```bash\n([\s\S]*?)\n```/g)].map((match) => match[1] ?? "");
const rootAssignment =
	'VISUAL_QA_ROOT="${CODEX_HOME:-$HOME/.codex}/skills/visual-qa"';

describe("visual-qa installed runtime command contract", () => {
	it("resolves every advertised Node command through the copied skill root", () => {
		expect(skill).toContain(rootAssignment);
		expect(skill).not.toMatch(/(?:^|\n)node scripts\//);
		for (const script of [
			"validate-review-receipt.mjs",
			"validate-evidence.mjs",
			"cli.mjs",
		]) {
			expect(skill).toContain(`node "$VISUAL_QA_ROOT/scripts/${script}"`);
		}
	});

	it("makes every advertised runtime block self-contained", () => {
		const runtimeBlocks = bashBlocks.filter((block) =>
			block.includes('node "$VISUAL_QA_ROOT/scripts/'),
		);
		expect(runtimeBlocks.length).toBeGreaterThan(0);
		for (const block of runtimeBlocks) {
			expect(block, `runtime block must resolve its own root:\n${block}`).toContain(rootAssignment);
		}
	});
});
