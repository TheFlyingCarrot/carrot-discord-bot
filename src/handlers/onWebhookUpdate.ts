import { client, DiscordJS } from '../internal'

const webhookActionMap = { 'WEBHOOK_CREATE': 'Create Webhook', 'WEBHOOK_UPDATE': 'Update Webhook', 'WEBHOOK_DELETE': 'Delete Webhook' }
const embedActions = { 'CREATE': '#00ff00', 'DELETE': '#ff0000', 'UPDATE': '#ff6400', 'ALL': '#ff00ff' }

export async function onWebhookUpdate (channel: DiscordJS.TextChannel): Promise<void> {
	if (channel.name === 'logs' || !channel.guild || !channel.guild.available) return

	const eventLog: DiscordJS.GuildAuditLogsEntry = (await channel.guild.fetchAuditLogs({ limit: 1, type: 'WEBHOOK_UPDATE' })).entries.first()
	if (!eventLog) {
		console.log('A webhook was updated, but no relevant audit logs were found.')
		return
	}
	if (eventLog.action != 'MESSAGE_DELETE') return

	const logChannel = channel.guild.channels.cache.find(channel => channel.name === 'logs' && channel.type === 'text') as DiscordJS.TextChannel
	if (!logChannel) return

	const { executor, target } = eventLog

	if (typeof target != 'object' || target.constructor != DiscordJS.Webhook) {
		client.emit('warn', `${__filename} Invalid log detected.`)
		return
	}

	const newEmbed = new DiscordJS.MessageEmbed()
	newEmbed.setAuthor('Carrot Bot', 'https://raw.githubusercontent.com/TheFlyingCarrot/carrot-discord-bot/main/Carrot%20Bot.png')
		.setTimestamp()
		.setThumbnail(executor.displayAvatarURL({ dynamic: true, format: 'png', size: 256 }))
		.setColor(embedActions[eventLog.actionType] || '#ff6400')
		.setTitle('Webhook Updated')
		.addField('Executor', `${executor}`, true)
		.addField('Channel', `${channel}`, true)
		.addField('Action', webhookActionMap[eventLog.action] || 'Unknown')
		.setFooter(`Executor ID: ${executor.id} ${process.env.NODE_ENV === 'test' ? '| Test Build' : ''}`)
	if (eventLog.reason) newEmbed.addField('Reason', eventLog.reason, true)
	eventLog.changes.forEach(change => {
		if (change.old && change.new) {
			newEmbed.addField('Change', `Key: ${change.key}\nOld: ${change.old}\nNew: ${change.new}`, true)
		} else if (change.new) {
			newEmbed.addField('Change', `Key: ${change.key}\nValue: ${change.new}`, true)
		} else if (change.old) {
			newEmbed.addField('Change', `Key: ${change.key}\nValue: ${change.old}`, true)
		}
	})

	logChannel.send(newEmbed)
}
