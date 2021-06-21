const { Client, Collection } = require('discord.js'),
      client = new Client(),
      config = require('./configs/config.json'),
      fs = require('fs'),
      { green, red, magenta, blue, underline } = require('colors'),
      Database = require('easy-json-database');

client.prefix = config.prefix;
client.color = config.color;
client.yes = yes;
client.no = no;
client.botAllowed = config.botAllowed;
client.commands = new Collection();
client.events = new Collection();
client.botlogs = botslogs;
client.verificator = verificator;
client.version = "1.9";

// database


["aliases", "categories"].forEach(x => { client[x] = new Collection() });

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return undefined;
        const props = require(`./commands/${file}`),
              cmdName = file.split('.')[0];
        if (props.help.aliases) {
            props.help.aliases.forEach(alias => {
                client.aliases.set(alias, props);
            });
        }
        if (props.help.category) {
            client.categories.set(props.help.category, props);
        }
        console.log(`${green('[COMMANDS]')} Commande ${underline(cmdName)} chargée avec succès !`)
        client.commands.set(cmdName, props);
    })
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return undefined;
        const event = require(`./events/${file}`),
              eventName = file.split('.')[0];
        console.log(`${magenta('[EVENTS]')} Évènement ${eventName} chargé avec succès !`)
        client.events.set(eventName, event);
        client.on(eventName, event.bind(null, client));
    })
});
setTimeout(() => {
    console.log('==================================================================' + '\n' + blue(`Récapitulatif : ${client.commands.size} commandes chargées et ${client.events.size} évènements chargés`) + '\n' + '==================================================================')
}, 500)


client.login(config.token)