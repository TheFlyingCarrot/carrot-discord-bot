import Discord, { Client, Message, MessageEmbed } from '../internal.js'

const ban: Command = {
	name: 'ban',
  description: 'Ban a user.',
  enabled: true,
  toggleable: true,

  usage: '[user mention]',
  args: true,
  cooldown: 10,
  guildOnly: true,
  permission: 'BAN_MEMBERS',

  execute ({ client, message, args }: { client: Client, message: Message, args: string[] }, Debugging: boolean): string | null | void {
    if (!message.member.hasPermission(this.permission, { checkAdmin: true, checkOwner: true })) {
      message.channel.send(`${message.author}, you do not have permission to use that command.`)
      return null
    }
    if (!message.mentions.members.size) {
      message.channel.send(`${message.author}, you must tag a user.`)
      return null
    }
    const targetUser = message.mentions.members.first()
    if (!targetUser.bannable) {
      message.channel.send(`${message.author}, I can't ban that user.`)
      return null
    }
    targetUser.ban({reason: `Banned by: ${message.author.tag}`})
      .then(() => {
        const newEmbed = new MessageEmbed
        newEmbed.setAuthor('Carrot Bot', 'https://i.ibb.co/v3d9t9x/carrot-clip-art.png')
          .setThumbnail('https://i.ibb.co/QjCW2nx/user-banned.png')
          .setTimestamp()
          .setTitle('Ban Command')
          .addField(`**${targetUser}**`, `Banned by ${message.author}`)
        message.channel.send(newEmbed)
      })
      .catch((error) => {
        message.channel.send(`${message.author}, ${targetUser} could not be banned.`)
        return error
      })
  }

}

export default ban as Command