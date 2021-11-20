const { MessageEmbed } = require(`discord.js`);
const config = require(`../../config.json`);

  module.exports = {
    name: ``,
    category: ``,
    aliases: [],
    description: ``,
    usage: ``,
    perms: "",
    minargs: 1, // minimum args for the message, 0 == none [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
      try {

      }
      catch (err) {
        const e = new MessageEmbed()
        .setColor(client.colors.red)
        .setThumbnail(client.user.displayAvatarURL())
        .addField("➜ Une erreur est survenue !", "```js\n" + err.message + "```")
        message.reply({ embeds: [e] })
        client.emit("error", err)
      }
    },
  };