import { env } from "@up/main/schema"

export const defaultConfig = {
    token: env.NODE_ENV === "production" ? env.PRIMARY_DISCORD_TOKEN : env.TESTING_DISCORD_TOKEN,
    applicationId: env.NODE_ENV === "production" ? env.APPLICATION_ID : env.TESTING_APPLICATION_ID,
    clientId: env.NODE_ENV === "production" ? env.CLIENT_ID : env.TESTING_CLIENT_ID
};

