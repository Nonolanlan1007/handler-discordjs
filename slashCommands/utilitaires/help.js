const { MessageEmbed } = require("discord.js");
const config = require("../configs/config.json");
const ee = require("../configs/embed.json");
const settings = require("../configs/settings.json");
const { readdirSync } = require("fs")
const emojis = require("../configs/emojis.json")

module.exports = {
  name: "help", //the command name for the Slash Command
  description: "Recevoir de l'aide sur le robot.", //the command description for Slash Command Overview
  cooldown: 5,
  category: "u",
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
        {"String": { name: "commande", description: "Sur quelle commande souhaitez-vous recevoir de l'aide ?", required: false }},
  ],
  run: async (client, interaction) => {
    const { member, channelId, guildId, applicationId, 
          commandName, deferred, replied, ephemeral, 
          options, id, createdTimestamp 
          } = interaction; 
    const { guild } = member;
		const GetString = options.getString("commande")

        if (!GetString) {    
            const embed = new MessageEmbed()
              .setTitle(`Menu d'aide de ${client.user.username}`)
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
              .setDescription(`Envoyez \`/help [commande]\` pour obtenir plus d'informations !`)
              .setFooter(`handler v13 | Version ${client.version}`)
              .setTimestamp(new Date)
              .setColor(ee.color)
              .setFooter(ee.footertext, ee.footericon)
              .addField("➜ Utilitaires :", client.slashCommands.filter(command => command.category === "u").map((c) => `\`${command.category} ${c.name}\``).join(", "))
            return interaction.reply({ content: null, embeds: [embed] });
        }
        if (GetString) {
            const command = client.slashCommands.get("normal" + GetString.toLowerCase());
    
          if (!command) return interaction.reply({ content: `**${emojis.no} ➜ Impossible de retrouver une commande nommée \`/${GetString}\`**` });
    
          const embed = new MessageEmbed()
            .setTitle(`Informations sur la commande ${command.name}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(" <> sont des arguments requis\nEt [] sont des arguments optionnels.")
            .addField(
              "❱ Commande :",
              command.name ? `\`${command.name}\`` : "*Aucun nom défini.*"
            )
            .addField(
              "❱ Description :",
              command.description ? command.description : "*Aucune description définie.*"
            )
            .addField(
                "❱ Mode lent :",
                command.cooldown ? `${command.cooldown} secondes.` : `${settings.default_cooldown_in_sec} secondes.` 
            )
            .setTimestamp(new Date)
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
          return interaction.reply({ content: null, embeds: [embed] });
        }
    } 
};