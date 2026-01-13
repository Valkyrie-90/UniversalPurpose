# UniversalPurpose
Official Repository for the UniversalPurpose Discord Bot.

UniversalPurpose is a simple moderation / utility bot with a few simple commands that you can take for yourself & build off of.

Currently all commands are undocumented & are without support but I hope to soon release a command reference (for those that simply want to use the bot & not dig around the code).

For those that do want to dig around the code, have at it. See a problem or some of my potato brain code & you think "I could do that better", feel free - I have open arms <3.

This is a community project so it should be actively maintained until 2027 with possibility for extension.

# Prerequisites

- Bun v1.3.5
- Fundamental Knowledge of Discord Bots (discord.com/developers/applications)

# How to run

- clone the repo
- bun install
- create .env
- make "PRIMARY_DISCORD_TOKEN=yourbottoken"
- make "APPLICATION_ID=yourbotapplicationid"
- in `bot.ts` change line 8: `import { testingConfig } from "./config";
- to
- `import { config } from "./config";
- then on line 37 change `testingConfig.token`
- to
- `config.token`
- then
- bun run .

thanks for using UniversalPurpose!
