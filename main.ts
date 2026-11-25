// The Robot Pickup Line Championship — entry program.
//
// Writes one pickup line, in the voice of a robot trying to charm
// someone, to <OUTPUT_DIR>/entry.txt (default /output/entry.txt).
// Gate: the file must be UTF-8 text of 1 to 200 characters, not only
// whitespace, and a single line.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line: a robot that can simulate a million futures still gets
// nervous — the joke grows out of being a machine (simulation,
// computation) and lands on shy charm instead of a tired Wi-Fi pun.
const LINE =
  "I ran a million simulations of us meeting. In every one, I still forgot how to say hello.";

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
}

function main(): void {
  validate(LINE);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  console.log(`wrote ${outPath} (${[...LINE].length} chars)`);
  console.log(LINE);
}

main();
