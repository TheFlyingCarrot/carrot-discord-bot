import { Command, ExtendedClient } from '../typings.js'
import Discord, { Client, Message, MessageEmbed } from '../internal.js'
import { Collection } from 'discord.js'
const { prefix, developers } = require('../config.json')

const help: Command = {
    name: 'help',
    description: 'Commands or info about a specific command.',
    enabled: true,
    toggleable: true,

    aliases: ['commands', 'usage'],
    usage: '(command)',

    execute ({ client, message, args }: { client: ExtendedClient, message: Message, args: string[] }): void {
        const { commands } = client
        const newEmbed = new MessageEmbed()
        newEmbed.setAuthor('Carrot Bot', 'https://i.ibb.co/v3d9t9x/carrot-clip-art.png')
            .setThumbnail('https://i.ibb.co/MhzStmL/user-inquiry.png')
            .setTimestamp()
            .setTitle('Help Command')
        if (!args.length) {
            commands.forEach((command: Command) => {
                if (command.developerOnly && developers.includes(message.author.id)) {
                    newEmbed.addField(`**${command.name.replace(/^\w/u, character => character.toUpperCase())}** (dev-only)`, `${command.description}`, true)
                } else if (message.member && command.permission && message.member.hasPermission(command.permission, { checkAdmin: true, checkOwner: true })) {
                    newEmbed.addField(`**${command.name.replace(/^\w/u, character => character.toUpperCase())}** (restricted)`, `${command.description}`, true)
                } else {
                    newEmbed.addField(`**${command.name.replace(/^\w/u, character => character.toUpperCase())}**`, `${command.description}`, true)
                }
            })
            newEmbed.addField('More Info', `\nYou can use \`${prefix}help [command name]\` to get help on a specific command.`)
            if (message.channel.type != 'dm') message.channel.send(newEmbed)
            else if (message.channel.type == 'dm') message.author.send(newEmbed)
        } else {
            const name = args[0].toLowerCase()
            const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name))
            if (!command) {
                message.channel.send(`${message.author}, that's not a valid command.`)
                return null
            }
            newEmbed.addField('**Name:**', `${command.name}`)
            if (command.description) newEmbed.addField('**Description:**', `${command.description}`)
            if (command.aliases) newEmbed.addField('**Aliases:**', `${command.aliases.join(', ')}`)
            if (command.usage) newEmbed.addField('**Usage:**', `${prefix}${command.name} ${command.usage}`)
            newEmbed.addField('**Cooldown:**', `${command.cooldown || 3} second(s)`)
            message.channel.send(newEmbed)
        }
    }
}

export default help as Command
