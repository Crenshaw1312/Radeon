require('discord.js');

module.exports = {
    name: 'editembed',
    aliases: ['editemb'],
    description: 'Edits an existing embed sent by Radeon using JSON string.',
    usage: 'editembed <Message:ID> <JSON:Text>',
    cooldown: 3,
    permissions: 8192,
    guildOnly: true,
    run: async (client, message, args) => {
        if (args.length < 2) return client.errEmb('Insufficient Arguments Specified.\n```\neditembed <Message:ID> <JSON:Text>\n```', message);
        const msg = message.channel.messages.cache.get(args[0]);
        if (!msg) return client.errEmb('Invalid Message.\nEither the message ID provided was invalid or the message is not in the bot\'s cache.', message);
        if (msg.author.id != client.user.id) return client.errEmb('Message was not sent by this bot.', message);
        try {
            const embed = JSON.parse(args.slice(1).join(' '));
            await msg.edit({embed:embed});
            await message.react(':checkgreen:796925441771438080').catch(()=>{});
        } catch (err) {
            return client.errEmb(err.message, message);
        }
    }
}
