const { Client, Intents, Collection } = require("discord.js"),
      { version } = require("./package.json"),
      { readdirSync } = require("fs"),
      { join } = require("path"),
      colors = require("colors"),
      config = require("./config.json")


const client = new Client({
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection()
client.top = new Collection()
client.version = version;
client.config = require("./config.json");
client.colors = {
    red: "",
    basic: "",
    green: ""
}

// load commands
let count = 0;
const folders = readdirSync(join(__dirname, "commands"))
for (let i = 0; i < folders.length; i++) {
    const commands = readdirSync(join(__dirname, "commands", folders[i]))
    count = count + commands.length;
    for (const c of commands) {
        try {
            const command = require(join(__dirname, "commands", folders[i], c))
            client.commands.set(command.name, command)
        }
        catch (err) {
            console.log(colors.red("[COMMANDS]") + ` ➜ Impossible de charger la commande ${c} : ${err.stack || err}`)
        }
    }
    console.log(colors.green("[COMMANDS]") + ` ➜ ${client.commands.size}/${count} commande(s) chargées !`)
}

// load events
let counting = 0;
const files = readdirSync(join(__dirname, "events"));
files.forEach((e) => {
	try {
		counting++;
		const fileName = e.split('.')[0];
		const file = require(join(__dirname, "events", e));
		client.on(fileName, file.bind(null, client));
		delete require.cache[require.resolve(join(__dirname, "events", e))];
	} catch (error) {
		console.log(`${colors.red('[Events]')} ➜ Une erreur est survenue lors du chargement de l'évènement ${e}: ${error.stack || error}`)
	}
});
console.log(`${colors.green('[Events]')} ➜ ${counting}/${files.length} évènement(s) chargé(s).`)

// load slashs
const { lstatSync } = require("fs");
const { SlashCommandBuilder } = require('@discordjs/builders');
const dirSetup = config.slashCommandsDirs;
module.exports = (client) => {
    try {
		let allCommands = [];
        readdirSync("./slashCommands/").forEach((dir) => {
			if(lstatSync(`./slashCommands/${dir}`).isDirectory()) {
				const groupName = dir;
				const cmdSetup = dirSetup.find(d=>d.Folder == dir);
				//If its a valid cmdsetup
				if(cmdSetup && cmdSetup.Folder) {
					//Set the SubCommand as a Slash Builder
					const subCommand = new SlashCommandBuilder().setName(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase()).setDescription(String(cmdSetup.CmdDescription));
					//Now for each file in that subcommand, add a command!
					const slashCommands = readdirSync(`./slashCommands/${dir}/`).filter((file) => file.endsWith(".js"));
					for (let file of slashCommands) {
						let pull = require(`../slashCommands/${dir}/${file}`);
						if (pull.name && pull.description) {
							subCommand
							.addSubcommand((subcommand) => {
								subcommand.setName(String(pull.name).toLowerCase()).setDescription(pull.description)
								if(pull.options && pull.options.length > 0){
									for(const option of pull.options){
										if(option.User && option.User.name && option.User.description){
											subcommand.addUserOption((op) =>
												op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
											)
										} else if(option.Integer && option.Integer.name && option.Integer.description){
											subcommand.addIntegerOption((op) =>
												op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
											)
										} else if(option.String && option.String.name && option.String.description){
											subcommand.addStringOption((op) =>
												op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
											)
										} else if(option.Channel && option.Channel.name && option.Channel.description){
											subcommand.addChannelOption((op) =>
												op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
											)
										} else if(option.Role && option.Role.name && option.Role.description){
											subcommand.addRoleOption((op) =>
												op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
											)
										} else if(option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0){
											subcommand.addStringOption((op) =>
												op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
												.addChoices(option.StringChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),String(c[1])] )),
											)
										} else if(option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0){
											subcommand.addStringOption((op) =>
												op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
												.addChoices(option.IntChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),parseInt(c[1])] )),
											)
										} else {
											console.log(`Une option est manquante dans la description ou le nom de la commande ${pull.name}`)
										}
									}
								}
								return subcommand;
							})
							client.slashCommands.set(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase() + " " + pull.name, pull)
						} else {
							console.log(file, `[ERROR] Il me manque un help.name, ou help.name n'est pas un string.`.brightRed);
							continue;
						}
					}
					//add the subcommand to the array
					allCommands.push(subCommand.toJSON());
				} 
				else {
					return console.log(`Le dossier de sous-commandes ${dir} n'est pas configuré dans le fichier config.json`);
				}
			} else {
				let pull = require(`../slashCommands/${dir}`);
				if (pull.name && pull.description) {
					let Command = new SlashCommandBuilder().setName(String(pull.name).toLowerCase()).setDescription(pull.description);
						if(pull.options && pull.options.length > 0){
							for(const option of pull.options){
								if(option.User && option.User.name && option.User.description){
									Command.addUserOption((op) =>
										op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
									)
								} else if(option.Integer && option.Integer.name && option.Integer.description){
									Command.addIntegerOption((op) =>
										op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
									)
								} else if(option.String && option.String.name && option.String.description){
									Command.addStringOption((op) =>
										op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
									)
								} else if(option.Channel && option.Channel.name && option.Channel.description){
									Command.addChannelOption((op) =>
										op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
									)
								} else if(option.Role && option.Role.name && option.Role.description){
									Command.addRoleOption((op) =>
										op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
									)
								} else if(option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0){
									Command.addStringOption((op) =>
										op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
										.addChoices(option.StringChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),String(c[1])] )),
									)
								} else if(option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0){
									Command.addStringOption((op) =>
										op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
										.addChoices(option.IntChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),parseInt(c[1])] )),
									)
								} else {
									console.log(`Une option est manquante dans le nom ou la description de la commande ${pull.name}`)
								}
							}
						}
						allCommands.push(Command.toJSON());
						client.slashCommands.set("normal" + pull.name, pull)
				} 
				else {
					console.log(file, `[ERROR] Il me manque un help.name, ou help.name n'est pas un string.`.brightRed);
				}
			}
        });
        
		//Once the Bot is ready, add all Slas Commands to each guild
		client.on("ready", () => {
			if(config.loadSlashsGlobal){
				client.application.commands.set(allCommands)
				.then(slashCommandsData => {
					console.log(`${slashCommandsData.size} commandes slash ${`(Avec ${slashCommandsData.map(d => d.options).flat().length} sous commandes)`.green} ${`chargées sur tous les serveurs.`}`.brightGreen); 
					console.log(`Vu que vous avez activé le mode global pour certaines commandes, je peux prendre jusqu'à 1 heure pour les charger sur tous les serveurs.`.brightGreen)
				}).catch((e)=>console.log(e));
			} else {
				client.guilds.cache.map(g => g).forEach((guild) => {
					try{
						guild.commands.set(allCommands)
						.then(slashCommandsData => {
							console.log(`${slashCommandsData.size} commandes slash ${`(Avec ${slashCommandsData.map(d => d.options).flat().length} sous-commandes)`.green} chargée(s) pour le serveur : ${`${guild.name}`.underline}`.brightGreen); 
						}).catch((e)=>console.log(e));
					}catch (e){
						console.log(String(e).grey)
					}
				});
			}
		})
		//DISABLE WHEN USING GLOBAL!
		client.on("guildCreate", (guild) => {
			try{
				if(!config.loadSlashsGlobal){
					guild.commands.set(allCommands)
						.then(slashCommandsData => {
							console.log(`${slashCommandsData.size} commandes slash ${`(With ${slashCommandsData.map(d => d.options).flat().length} sous-commandes)`.green} chargée(s) pour le serveur : ${`${guild.name}`.underline}`.brightGreen); 
						}).catch((e)=>console.log(e));
				}
			}catch (e){
				console.log(String(e).grey)
			}
		})
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};




// login to discord
client.login(client.config.token)
