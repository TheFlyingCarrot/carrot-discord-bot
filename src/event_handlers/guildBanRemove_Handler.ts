import { client, Discord } from '../internal.js'

export async function handleGuildBanRemove (guild: Discord.Guild, user: Discord.User) {
	if (!guild.available) return

	if (client.events.guildBanRemove === false) return

	const logChannel = guild.channels.cache.find(channel => channel.name === "logs" && channel.type === "text") as Discord.TextChannel
	if (!logChannel) return

	try {
		const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_REMOVE" })
		const banRemoveLog = fetchedLogs.entries.first()

		const { executor, reason } = banRemoveLog

		const newEmbed = new Discord.MessageEmbed()

		newEmbed.setAuthor('Carrot Bot', 'https://i.ibb.co/v3d9t9x/carrot-clip-art.png')
			.setTimestamp()
			.setThumbnail(executor.displayAvatarURL({ dynamic: true, format: 'png', size: 256 }))
			.setColor("#00ff00")
			.setTitle('User Unbanned')
			.addField("Unbanned User", user.tag)
			.addField("Executor", executor || "Unknown", true)
			.addField("Reason", reason || "Unspecified", true)
			.setFooter(`User ID: ${user.id} | Executor ID: ${executor.id}${process.env.ENV_TYPE == 'test' ? ' | Test Build' : ''}`)

		logChannel.send(newEmbed)
	} catch (error) {
		console.error(error)
	}
}