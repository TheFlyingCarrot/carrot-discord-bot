// Pre-Initalization
const fs = require('fs')
const Discord = require('discord.js')
const { prefix, developers } = require('./helper_modules/config.json')
const debug_logger = require('./helper_modules/debug_logger')
const reaction_handler = require('./helper_modules/reaction_handler')
const cooldown_handler = require('./helper_modules/cooldown_handler')
const command_validator = require('./helper_modules/command_validator')
const perf = require('execution-time')(console.log)

// Discord Initialization
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
client.login(process.env.BOT_TOKEN)
client.commands = new Discord.Collection()
const cooldowns = new Discord.Collection()

// Command Palette Setup
for (const file of fs.readdirSync('./command_modules')) {
	const command = require(`./command_modules/${file}`)
	client.commands.set(command.name, command)
}

// Triggers when the client (bot) is ready.
client.once('ready', () => {
	console.log('Bot Client State: Ready')
})

// Triggers when any message in any guild has a reaction added to it.
client.on('messageReactionAdd', async (reaction, user) => {
	perf.start('Reaction Processing')
	if (reaction.partial) {
		try {
			await reaction.fetch()
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error)
			return null
		}
	}

	reaction_handler.execute({ client, reaction, user })

	perf.stop('Message Processing')
})

// Triggers when any new message is recieved by the bot (client).
client.on('message', message => {
	perf.start('Message Processing')
	// Command Validator | ./helper_modules/command_validator
	const { command, args } = command_validator.execute({ client, message, prefix, developers, cooldowns, debug_logger, Discord })
	if (!command || !args) {
		perf.stop('Message Processing')
		return null
	}
	// Cooldown Handling | ./helper_modules/cooldown_handler
	if (!cooldown_handler.execute({ message, command, cooldowns, developers })) {
		perf.stop('Message Processing')
		return null
	}
	// Command Execution
	try {
		const command_execution_logs = command.execute({ client, message, args, templateEmbed: new Discord.MessageEmbed() })
		if (command_execution_logs) { console.log(command_execution_logs) }
	} catch (err) {
		console.log(err)
		message.channel.send(`${message.author}, \`${command.name}\` produced an unknown error.`)
	} finally {
		perf.stop('Message Processing')
	}
})

process.on('uncaughtException', (err) => console.log(err))
