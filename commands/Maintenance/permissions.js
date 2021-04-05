const { Permissions, MessageEmbed } = require('discord.js');
const { humanize } = require('../../functions/functions');

module.exports = {
    name: 'permissions',
    aliases: ['perms','permsof'],
    tag: 'Permissions Tools: subcommands for permissions',
    description: 'Permissions Tools: can send the permissions of a specified user or triggering user, and permissions in a specified channel.',
    usage:'permissions [User:Mention/ID]\npermissions create <\\n...Permissions:Name>\npermissions resolve <Bitfield:Number>\npermissions in <Channel:Mention/ID>',
    guildOnly: true,
    run: async (client, message, args) => {
        if (args.length) {
            if (args[0].toLowerCase() == 'create') {
                if (!args[1]) return client.errEmb('No Permissions Specified. Make sure permissions are on separate lines.\n```\npermissions create\n<...Permission:Name>\n```', message);
                let perms = args.slice(1).join(' ').toUpperCase();
                if (perms.includes(';')) perms = perms.split(';'); else perms = [perms];
                let notFlag = false;
                const permList = ['CREATE_INSTANT_INVITE','KICK_MEMBERS','BAN_MEMBERS','ADMINISTRATOR','MANAGE_CHANNELS','MANAGE_GUILD','ADD_REACTIONS','VIEW_AUDIT_LOG','PRIORITY_SPEAKER','STREAM','VIEW_CHANNEL','SEND_MESSAGES','SEND_TTS_MESSAGES','MANAGE_MESSAGES','EMBED_LINKS',
                'ATTACH_FILES','READ_MESSAGE_HISTORY','MENTION_EVERYONE','USE_EXTERNAL_EMOJIS','VIEW_GUILD_INSIGHTS','CONNECT','SPEAK','MUTE_MEMBERS','DEAFEN_MEMBERS','MOVE_MEMBERS','USE_VAD','CHANGE_NICKNAME','MANAGE_NICKNAMES','MANAGE_ROLES','MANAGE_WEBHOOKS','MANAGE_EMOJIS'];
                perms.forEach(p => {
                    const _p = p.trim().replace(/ /g, '_');
                    if (!permList.includes(_p)) notFlag = true
                });
                if (notFlag) return client.errEmb('Specified Arguments Contains Invalid Flags.', message);
                let newPerms = new Permissions;
                perms.forEach(p => newPerms.add(p.trim().replace(/ /g, '_')));
                const embed = new MessageEmbed()
                .setTitle('Permissions')
                .setDescription(`Generated Permission Bitfield: **\`${newPerms.bitfield}\`**`)
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);

            } else if (args[0].toLowerCase() == 'resolve') {
                if (!args[1]) return client.errEmb('No Permission Bitfield Provided.\n```\npermissions resolve <Bitfield:Number>\n```', message);
                const bit = parseInt(args[1]);
                if (isNaN(bit)) return client.errEmb('Invalid Bitfield Provided.', message);
                const res = new Permissions(bit);
                const embed = new MessageEmbed()
                .setTitle('Permissions')
                .setDescription(`Resovled from Bitfield **\`${bit}\`**\n\`\`\`\n${humanize(res).join(', ')}\n\`\`\``)
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);

            } else if (args[0].toLowerCase() == 'in') {
                if (!args[1]) return client.errEmb('No Channel Specified.\n```\npermissions in <Channel:Mention/ID>\n```', message);
                const chan = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
                if (!chan) return client.errEmb('Unknown Channel Specified.', message);
                const embed = new MessageEmbed()
                .setTitle(`Permissions in ${chan.name}`)
                .setDescription(`\`\`\`\n${humanize(chan.permissionsFor(message.author)).join(', ')}\n\`\`\``)
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);
            } else {
                const target = message.mentions.members.first() || message.guild.member(args[0]);
                if (!target) return client.errEmb('Invalid Member Specified.', message);
                const embed = new MessageEmbed()
                .setAuthor(`Permissions of ${target.user.tag}`, target.user.displayAvatarURL())
                .setDescription(`\`\`\`\n${humanize(target.permissions).join(', ')}\n\`\`\``)
                .setColor(0x1e143b)
                .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);
            }

        } else {
            const embed = new MessageEmbed()
            .setAuthor(`Permissions of ${message.author.tag}`, message.author.displayAvatarURL())
            .setDescription(`\`\`\`\n${humanize(message.member.permissions).join(', ')}\n\`\`\``)
            .setColor(0x1e143b)
            .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            message.channel.send(embed);
        }
    }
}