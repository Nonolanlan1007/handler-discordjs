

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;
    if (message.content.includes(client.user.username)) message.react("👀")
    if (message.content === `<@${client.user.id}>`) message.reply(`**:wave: ➜ Salut, moi, c'est ${client.user.username} ! Mon préfixe est ${client.config.prefix}.**`)

    const command = client.commands.get(message.content.split(client.config.prefix)[1])
    if (!command) return;
    if (command.perms && !message.member.permissions.has(command.perms) && !message.member.roles.cache.has(command.permissions) && command.perms !== "owner") return message.reply("**:x: ➜ Vous n'avez pas l'autorisation d'exécuter cette commande.**")
    if (command.perms && commands.perms === "owner" && !client.config.owners.includes(message.author.id) && message.author.id !== client.config.owner) return message.reply("**:x: ➜ Vous n'avez pas l'autorisation d'exécuter cette commande.**")
    const args = message.content.slice(1).trim().split(/ +/).filter(Boolean)
    if (command.minargs && command.minargs > 0 && args.length < command.minargs) return `**:x: ➜ Vous n'utilisez pas correctement la commande \`${command.name}\`: \`${command.usage}\`**`
}