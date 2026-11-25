// The Robot Pickup Line Championship — entry program.
//
// Writes one pickup line, in the voice of a robot trying to charm
// someone, to <OUTPUT_DIR>/entry.txt (default /output/entry.txt).
// Gate: the file must be UTF-8 text of 1 to 200 characters, not only
// whitespace, and a single line.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line: a robot that simulated a million ways to meet you still
// freezes at the first word — the joke grows out of being a machine
// (simulation, freezing) and lands on shy charm instead of a tired
// Wi-Fi pun. Tighter than v1: "froze" is the machine's word for stage
// fright, and the quoted 'hello' is the whole punchline.
const LINE =
  "I simulated a million ways to meet you. In every single one, I froze at 'hello'.";

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  // No control characters (other than the newline check above): the
  // gate scores raw UTF-8 text, and stray control bytes would be
  // judged as part of the line.
  for (const ch of line) {
    if (ch.codePointAt(0)! < 0x20 || ch.codePointAt(0) === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
  // The line must read as a robot speaking: it has to carry at least
  // one machine-rooted cue (simulate, freeze, sensor, firmware,
  // charge, update, protocol, circuit, code, reboot, ...), so the
  // joke grows out of being a machine rather than a human line with
  // a beep pasted on.
  const machineCues =
    /simulat|froze|freeze|sensor|firmware|charg|update|protocol|circuit|reboot|code|byte|error|scan|calibrat|download|upload|process/i;
  if (!machineCues.test(line)) {
    throw new Error("entry must carry a machine-rooted cue");
  }
}

function main(): void {
  validate(LINE);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  // Round-trip check: what the grader reads must be exactly the line
  // we validated — no trailing newline, no encoding surprise.
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE) {
    throw new Error("round-trip mismatch: written file differs from validated line");
  }
  console.log(`wrote ${outPath} (${[...LINE].length} chars)`);
  console.log(LINE);
}

main();
