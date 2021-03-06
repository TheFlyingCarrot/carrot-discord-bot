import { fs } from '../internal'
import { Command } from '../typings'

const guildInfo: Command = {
	name: 'guildinfo',
	description: 'Generate a JSON list of information for a server.',
	enabled: true,
	toggleable: true,

	aliases: ['guild-info'],

	guild_only: true,

	developer_only: true,

	async execute ({ message }) {
		const data = JSON.stringify(message.guild, null, '	')
		const filename = `${message.guild.id}.json`

		fs.writeFileSync(filename, data)
		message.reply('Here\'s the info for this guild.', { files: [filename] })
		setTimeout(() => {
			if (fs.existsSync(filename)) fs.unlinkSync(filename)
		}, 1000)

	}
}

export default guildInfo as Command
