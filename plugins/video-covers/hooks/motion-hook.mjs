// The video-covers plugin's own hooks. LitClaude 1.0.49 and earlier ran the lit-typographic-motion
// done-check from its Stop hook; the plugin carries that gate (lib/motion-render-gate.mjs, unchanged)
// and runs it here, so a film turn ends only when the done-check says the film is done.
//
// LitClaude armed the turn from its prompt router. Without it, a turn is armed when the model loads
// the lit-typographic-motion skill or runs its motion.mjs, and every new prompt clears it.
// Every failure here allows the turn to end: a hook must never trap a session on its own state.
import { readFileSync } from "node:fs";

import { evaluateMotionStop, MOTION_DISCIPLINE, motionTurnPath, observeMotionTool, parseMotionCommand, recordMotionTurn } from "../lib/motion-render-gate.mjs";
import { resolveProjectStateRoot } from "../lib/project-state-root.mjs";

const event = process.argv[2];

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}
const cwd = typeof input.cwd === "string" ? input.cwd : process.cwd();
const root = () => resolveProjectStateRoot(cwd);
const isMotionSkill = (name) => typeof name === "string" && name.replace(/^[a-z-]+:/u, "") === MOTION_DISCIPLINE;

try {
  if (event === "user-prompt-submit") {
    recordMotionTurn(root(), { sessionId: input.session_id, discipline: null });
  } else if (event === "post-tool-use") {
    // Arming again would drop the runs already recorded, so a turn is armed only when this session has none.
    const armed = () => {
      try {
        return JSON.parse(readFileSync(motionTurnPath(root()), "utf8")).sessionId === input.session_id;
      } catch {
        return false;
      }
    };
    const arm = () => recordMotionTurn(root(), { sessionId: input.session_id, discipline: MOTION_DISCIPLINE });
    if (input.tool_name === "Skill" && isMotionSkill(input.tool_input?.skill)) {
      if (!armed()) arm();
    } else if (input.tool_name === "Bash" && typeof input.tool_input?.command === "string" && parseMotionCommand(input.tool_input.command, cwd)) {
      if (!armed()) arm();
      observeMotionTool(root(), { input });
    }
  } else if (event === "stop") {
    const gate = await evaluateMotionStop({ cwd: root(), sessionId: input.session_id, transcriptPath: input.transcript_path });
    if (gate.action === "block") console.log(JSON.stringify({ decision: "block", reason: gate.reason }));
  }
} catch {
  // Fail safe, as in LitClaude: an unreadable or unwritable state file only means no reminder.
}
