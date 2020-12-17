import { Command, Discord, ExtendedClient } from '../internal.js'

const reload: Command = {
	name: 'reload',
	description: 'Reload a command.',
	enabled: true,
	toggleable: false,

	developerOnly: true,

	execute ({ client, message, args }: { client: ExtendedClient, message: Discord.Message, args: string[] }): void {
		if (!args.length) {
			message.reply('You didn\'t give me anything to reload.')
			return null
		}
		const commandName = args[0].toLowerCase()
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
		if (!command) {
			message.reply('No such command was found.')
			return null
		}
		delete require.cache[require.resolve(`./${command.name}.js`)]
		const newEmbed = new Discord.MessageEmbed()
		newEmbed.setAuthor('Carrot Bot', 'https://i.ibb.co/v3d9t9x/carrot-clip-art.png')
			.setThumbnail('https://i.ibb.co/sJ4CyGj/admin-check.png')
			.setTimestamp()
			.setTitle('Reload Command')
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const newCommand = require(`./${command.name}`)

			client.commands.set(newCommand.default.name, newCommand.default)

			newEmbed.addField('Command Success', `Command \`${commandName}\` was reloaded!`)
			message.channel.send(newEmbed)
			console.log('[Command] [Reload] [Success]', `Command: ${newCommand.default.name.replace(/^\w/u, character => character.toUpperCase())} reloaded.`)
		} catch (error) {
			console.error('[Command] [Reload] [Fail]', error)
			return error
		}
	}
}

export default reload as Command
