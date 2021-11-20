const { MessageEmbed } = require("discord.js"),
      { onCoolDown } = require("../fonctions/onCooldown")

module.exports = async (client, interaction) => {
    if (interaction.author.bot || !interaction.guild) return;

    const CategoryName = interaction.commandName;
	let command = false;
	try {
    	    if (client.slashCommands.has(CategoryName + " " + interaction.options.getSubcommand())) {
      		command = client.slashCommands.get(CategoryName + " " + interaction.options.getSubcommand());
    	    }
  	}catch {
    	    if (client.slashCommands.has("normal" + CategoryName)) {
      		command = client.slashCommands.get("normal" + CategoryName);
   	    }
      }
    if (command === false) return;
    if (command.perms && !interaction.member.permissions.has(command.perms) && !interaction.member.roles.cache.has(command.permissions) && command.perms !== "owner") return interaction.reply("**:x: ➜ Vous n'avez pas l'autorisation d'exécuter cette commande.**")
    if (command.perms && commands.perms === "owner" && !client.config.owners.includes(interaction.author.id) && interaction.author.id !== client.config.owner) return interaction.reply("**:x: ➜ Vous n'avez pas l'autorisation d'exécuter cette commande.**")
    if (onCoolDown(interaction, command)) return interaction.reply(`**:x: ➜ Veuillez patienter encore \`${onCoolDown(interaction, command)}\` secondes avant de pouvoir réutiliser la commande \`${command.name}\`.**`)

    try { command.run(client, interaction) }
    catch {
        const e = new MessageEmbed()
        .setColor(client.colors.red)
        .setThumbnail(client.user.displayAvatarURL())
        .addField("➜ Une erreur est survenue !", "```js\n" + err.message + "```")
        interaction.reply({ embeds: [e] })
        client.emit("error", err)
    }
}