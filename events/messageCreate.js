const { MessageEmbed } = require("discord.js");
const { onCoolDown } = require("../fonctions/onCooldown");

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;
    if (message.content.includes(client.user.username)) message.react("👀")
    if (message.content === `<@${client.user.id}>`) message.reply(`**:wave: ➜ Salut, moi, c'est ${client.user.username} ! Mon préfixe est ${client.config.prefix}.**`)

    const command = client.commands.find(cmd => cmd.aliases.includes(message.content.split(client.config.prefix)[1])) || client.commands.get(message.content.split(client.config.prefix)[1])
    if (!command) return;
    if (command.perms && !message.member.permissions.has(command.perms) && !message.member.roles.cache.has(command.permissions) && command.perms !== "owner") return message.reply("**:x: ➜ Vous n'avez pas l'autorisation d'exécuter cette commande.**")
    if (command.perms && commands.perms === "owner" && !client.config.owners.includes(message.author.id) && message.author.id !== client.config.owner) return message.reply("**:x: ➜ Vous n'avez pas l'autorisation d'exécuter cette commande.**")
    const args = message.content.slice(1).trim().split(/ +/).filter(Boolean)
    if (command.minargs && command.minargs > 0 && args.length < command.minargs) return message.reply(`**:x: ➜ Vous n'utilisez pas correctement la commande \`${command.name}\`: \`${command.usage}\`**`)
    if (onCoolDown(message, command)) return message.reply(`**:x: ➜ Veuillez patienter encore \`${onCoolDown(message, command)}\` secondes avant de pouvoir réutiliser la commande \`${command.name}\`.**`)

    try { command.run(client, message, args) }
    catch {
        const e = new MessageEmbed()
        .setColor(client.colors.red)
        .setThumbnail(client.user.displayAvatarURL())
        .addField("➜ Une erreur est survenue !", "```js\n" + err.message + "```")
        message.reply({ embeds: [e] })
        client.emit("error", err)
    }
}
