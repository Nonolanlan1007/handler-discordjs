const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "help", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Information", //the command category for helpcmd [OPTIONAL]
  aliases: ["h", "commandinfo", "cmds", "cmd"], //the command aliases for helpcmd [OPTIONAL]
  cooldown: 3, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "help [Commandname]", //the command usage for helpcmd [OPTIONAL]
  description: "Recevoir de l'aide sur le robot.", //the command description for helpcmd [OPTIONAL]
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
    run: async (client, message, args) => {
      try{
        if (args[0]) {
          const embed = new MessageEmbed();
          const cmd = client.commands.get(args[0].toLowerCase());
          if (!cmd) {
              return message.reply({embeds: [embed.setColor(client.colors.red).setDescription(`Commande introuvable.`)]});
          }
          if (cmd.name) embed.addField("**Nom :**", `\`${cmd.name}\``);
          if (cmd.description) embed.addField("**Description :**", `\`${cmd.description}\``);
          if (cmd.aliases) embed.addField("**Aliases :**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
          if (cmd.cooldown) embed.addField("**Cooldown :**", `\`${cmd.cooldown || 0} secondes\``);
          if (cmd.usage) {
              embed.addField("**Utilisation :**", `\`${prefix}${cmd.usage}\``);
              embed.setFooter("Syntaxe : <> = required, [] = optional");
          }
          embed.setColor(client.colors.basic)
          return message.reply({embeds: [embed]});
        } else {
          const embed = new MessageEmbed()
              .setColor(ee.color)
              .setThumbnail(client.user.displayAvatarURL())
              .setTitle("Commandes :")
              const commands = (category) => {
              return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
          };
          try {
            for (let i = 0; i < client.categories.length; i += 1) {
              const current = client.categories[i];
              const items = commands(current);
              embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${items.join(", ")}`);
            }
          } catch (e) {
              console.log(String(e.stack).red);
          }
          message.reply({embeds: [embed]});
      }
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.reply({embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]});
    }
  }
}