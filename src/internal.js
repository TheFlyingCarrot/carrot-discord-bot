export * as DiscordAPITypes from 'discord-api-types/v8'
export * as DiscordJS from 'discord.js'
export * as fs from 'fs'
export { fetch } from 'node-fetch'
export * as path from 'path'
export { default as ExtendedClient } from './client_modules/ExtendedClient'
export { generateCommands } from './client_modules/generateCommands'
export { generateSlashCommands } from './client_modules/generateSlashCommands'
export { getCommand } from './client_modules/getCommand'
export { getSlashCommand } from './client_modules/getSlashCommand'
export { logToGuild } from './client_modules/logToGuild'
export { parseCommandFromMessage } from './client_modules/parseCommandFromMessage'
export { config } from './config'
export { createRole } from './helper_modules/createRole'
export { client } from './index'

import { onGuildBanAdd } from './handlers/onGuildBanAdd'
import { onGuildBanRemove } from './handlers/onGuildBanRemove'
import { onGuildMemberRemove } from './handlers/onGuildMemberRemove'
import { onInteractionCreate } from './handlers/onInteractionCreate'
import { onMessage } from './handlers/onMessage'
import { onMessageDeletion } from './handlers/onMessageDelete'
import { onMessageReactionAdd } from './handlers/onMessageReactionAdd'
import { onMessageReactionRemove } from './handlers/onMessageReactionRemove'
import { onMessageUpdate } from './handlers/onMessageUpdate'
import { onReady } from './handlers/onReady'
import { onWebhookUpdate } from './handlers/onWebhookUpdate'
import { canUseCommand } from './helper_modules/canUseCommand'
import { cooldown } from './helper_modules/cooldown'
import { fetchPartial } from './helper_modules/fetchPartial'
import { isValidReaction } from './helper_modules/isValidReaction'

export const EventHandlers = {
	onGuildBanAdd,
	onGuildBanRemove,
	onGuildMemberRemove,
	onInteractionCreate,
	onMessage,
	onMessageDeletion,
	onMessageReactionAdd,
	onMessageReactionRemove,
	onMessageUpdate,
	onReady,
	onWebhookUpdate
}
export const HelperModules = {
	canUseCommand,
	cooldown,
	fetchPartial,
	isValidReaction
}
