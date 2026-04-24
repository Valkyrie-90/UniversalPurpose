import { z } from "zod"

const envSchema = z.object({
    PRIMARY_DISCORD_TOKEN: z.string().min(1),
    CLIENT_ID: z.string().min(1),
    APPLICATION_ID: z.string().min(1),

    // Testing
    TESTING_DISCORD_TOKEN: z.string(),
    TESTING_CLIENT_ID: z.string(),
    TESTING_APPLICATION_ID: z.string(),

    // Role Names
    BOT_MASTER_ROLE_NAME: z.string().min(1),
    GBAN_ROLE_NAME: z.string().min(1),

    // App
    NODE_ENV: z.enum([ "development", "production" ])
})

export const env = envSchema.parse(process.env)