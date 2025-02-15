require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'slowmode',
    aliases: ['sm'],
    description: 'Set\'s the slowmode time for the triggering channel. To disable slowmode put `0` or `off`.',
    usage: 'slowmode <Time:duration> [Reason:text]\nslowmode off',
    cooldown: 2,
    permissions: 16,
    guildOnly: true,
    run: async (client, message, args) => {
        if (args.length < 1) return client.errEmb('No Duration Specified.\n```\nslowmode <Time:duration> [Reason:text]\nslowmode off\n```', message);
        let time, reason = '(No Reason Specified)';
        if (args[0] === 'off') time = 0; else time = ms(args[0]) / 1000;
        if (isNaN(time)) return client.errEmb(`Invalid Duration \`${time}\``, message);
        if (time < 0 || time > 216000) return client.errEmb('Time must be more than 0 and less than 6hours (21600 seconds).', message);
        if (args.length > 1) reason = args.slice(1).join(' ');
        const radeon = message.guild.member(client.user.id);
        if (!radeon.permissionsIn(message.channel).has('MANAGE_CHANNELS')) return client.errEmb('Unable to Edit: Missing Permission `MANAGE CHANNELS`', message);
        try {
            await message.channel.setRateLimitPerUser(time, message.author.tag +': '+ reason);
            if (time === 0 || 'off') return client.checkEmb('Slowmode Successfully Disabled!', message);
            else return client.checkEmb(`Slowmode Successfully Set to ${ms(time * 1000, {long: true})}!`);
        } catch (err) {
            return client.errEmb('Unknown: Failed Setting Slowmode.', message);
        }
    }
}
