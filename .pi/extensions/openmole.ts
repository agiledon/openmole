/**
 * OpenMole plugin for Pi (pi-coding-agent) — registers skills + commands, short bootstrap.
 *
 * Mirrors the OpenCode plugin: skills are contributed via `resources_discover`,
 * commands are registered as `/mole-*` slash commands that load the matching
 * `openmole-*` skill, and a one-time bootstrap message is injected on the first
 * agent turn.
 *
 * Zero npm deps at runtime: the only import from the Pi SDK is type-only and is
 * erased during TypeScript stripping.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = path.resolve(__dirname, "..", "..");
const SKILLS_DIR = path.join(PLUGIN_ROOT, "skills");
const COMMANDS_DIR = path.join(PLUGIN_ROOT, "commands");

const BOOTSTRAP = `<OPENMOLE-BOOTSTRAP>
OpenMole is installed.
Workspace: \`openmole/config.yaml\` + \`openmole/changes/<change-name>/\`.
Commands: /mole-explore, /mole-plan, /mole-verify, /mole-apply, /mole-archive
Load the matching openmole-* skill for each command.
</OPENMOLE-BOOTSTRAP>`;

interface CommandMeta {
  name: string;
  description: string;
}

function parseFrontmatter(content: string): { meta: Record<string, string> } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {} };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta };
}

function loadOpenMoleCommands(): CommandMeta[] {
  if (!fs.existsSync(COMMANDS_DIR)) return [];

  return fs
    .readdirSync(COMMANDS_DIR)
    .filter((file) => file.startsWith("mole-") && file.endsWith(".md"))
    .map((file) => {
      const content = fs.readFileSync(path.join(COMMANDS_DIR, file), "utf8");
      const { meta } = parseFrontmatter(content);
      const phase = file.replace(/^mole-/, "").replace(/\.md$/, "");
      const name = `mole-${phase}`;
      return { name, description: meta.description || `OpenMole ${phase} phase` };
    });
}

export default function (pi: ExtensionAPI): void {
  pi.on("resources_discover", () => {
    return { skillPaths: [SKILLS_DIR] };
  });

  for (const command of loadOpenMoleCommands()) {
    const skillName = command.name.replace(/^mole-/, "openmole-");

    pi.registerCommand(command.name, {
      description: command.description,
      handler: async (args: string, ctx: ExtensionContext) => {
        const suffix = args?.trim() ? ` ${args.trim()}` : "";
        const message = `/skill:${skillName}${suffix}`;

        if (ctx.isIdle()) {
          pi.sendUserMessage(message);
        } else {
          pi.sendUserMessage(message, { deliverAs: "followUp" });
          ctx.ui.notify(`OpenMole queued: ${message}`, "info");
        }
      },
    });
  }

  pi.on("before_agent_start", async (_event, ctx) => {
    const alreadyInjected = ctx.sessionManager
      .getEntries()
      .some((entry) => entry.type === "custom_message" && entry.customType === "openmole-bootstrap");

    if (alreadyInjected) return;

    return {
      message: {
        customType: "openmole-bootstrap",
        content: BOOTSTRAP,
        display: true,
      },
    };
  });
}
