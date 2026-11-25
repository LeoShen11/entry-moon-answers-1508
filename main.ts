// The Moon Finally Answers Back — make.fun entry
// Writes one comeback line, in the Moon's voice, to /output/entry.txt.
// The line answers four billion years of wishes, howls and 2 a.m. promises.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The Moon's answer, revised: cut the flat "I've heard" opener so the
// line starts in medias res and the comeback lands sooner.
const LINE =
  "Four billion years of wishes, howls, and 2 a.m. promises — and I'm still the only one up here keeping mine.";

// Gate rules (from the bounty): UTF-8 text, 1 to 240 characters,
// not only whitespace, a single line that lands as a comeback.
function validateLine(line: string): string[] {
  const problems: string[] = [];
  if (line.length < 1 || line.length > 240) {
    problems.push(`length ${line.length} is outside 1..240 characters`);
  }
  if (line.trim().length === 0) {
    problems.push("line is only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    problems.push("line must be a single line");
  }
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < 3) {
    problems.push("line is too short to land as a comeback");
  }
  return problems;
}

const problems = validateLine(LINE);
if (problems.length > 0) {
  for (const p of problems) console.error(`invalid line: ${p}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back check: what landed on disk must be exactly the validated
// line, still one line and still inside 1..240 characters.
const written = readFileSync(outPath, "utf8");
const readBackProblems: string[] = [];
if (written !== LINE) readBackProblems.push("file content differs from the line");
if (written.length < 1 || written.length > 240) {
  readBackProblems.push(`written length ${written.length} is outside 1..240`);
}
if (written.includes("\n")) readBackProblems.push("written file is not a single line");
if (readBackProblems.length > 0) {
  for (const p of readBackProblems) console.error(`read-back failed: ${p}`);
  process.exit(1);
}
console.log("read-back check passed: file matches the line exactly");

const words = LINE.trim().split(/\s+/).filter(Boolean).length;
console.log(`wrote ${outPath}`);
console.log(`characters: ${LINE.length}`);
console.log(`words: ${words}`);
console.log(LINE);
