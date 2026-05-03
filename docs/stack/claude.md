# Claude Code

**What:** Anthropic's coding agent. Used both to *build* scaffoldo and to *invoke* scaffoldo via the `/scaffold-saas` skill.

**Why chosen:** Strong long-context model (1M tokens on Opus 4.7), good agentic tool use, native skill system that maps cleanly onto the "interview the user" UX scaffoldo needs.

**Cost:** $20/mo Pro, $200/mo Max. The single recurring expense in the stack.

**Alternatives considered:** Cursor, GitHub Copilot CLI, Aider. Claude Code's skill + plan mode + memory system make it the right host for this kind of repo-level interview.

**Used in template by:**
- `.claude/skills/scaffold-saas/SKILL.md` — the in-Claude entry point that mirrors the CLI
- The user's global rules (`~/.claude/rules/*.md`) shape conventions in the generated code

**Env vars / secrets:** None. Authentication is per-user inside Claude Code.

**Setup:** Install Claude Code (`https://claude.com/claude-code`), open the scaffoldo repo, type `/scaffold-saas`.
