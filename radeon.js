const Discord = require('discord.js');
const client = new Discord.Client();
const {readdirSync} = require('fs');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = require('./config.json');
client.mongoose = require('./mongo.js');

readdirSync('./handlers/').forEach(handler => {
    if (!handler.endsWith('.handler.js')) return;
    require(`./handlers/${handler}`)(client);
});

client.successEmb = (msg) => {
    const e = new Discord.MessageEmbed()
    .setDescription('<:checkgreen:796925441771438080> '+ msg)
    .setColor(0x00d134);
    return e;
}

client.errEmb = (msg) => {
    const e = new Discord.MessageEmbed()
    .setDescription('<:crossred:796925441490681889> '+ msg)
    .setColor(0xd10000);
    return e;
}

process.on('unhandledRejection', error => {
    console.error('Unhandled Promise Rejection:', error);
    client.channels.cache.get("800755303477149696").send(`\`\`\`js\n${JSON.stringify(error, null, 2)}\n\`\`\`\n\`\`\`js\n${error.stack}\n\`\`\``);
});

client.mongoose.init();
client.login(client.config.token);
