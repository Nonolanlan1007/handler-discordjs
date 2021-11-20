const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: "",
  description: "",
  cooldown: 1,
  category: "",
  perms: "",
  options: [
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		//{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "type", description: "De quoi souhaitez-vous voir la latence ?", required: true, choices: [["Bot", "Latence du bot"], ["Discord API", "Latence de l'API"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction) => {
	   try {
		const { member, channelId, guildId, applicationId, 
			commandName, deferred, replied, ephemeral, 
			options, id, createdTimestamp 
	    } = interaction; 
	const { guild } = member;
   //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
   //const StringOption = options.getString("type"); //same as in StringChoices
   //let UserOption = options.getUser("OPTIONNAME");
   //let ChannelOption = options.getChannel("OPTIONNAME");
   //let RoleOption = options.getRole("OPTIONNAME");

   //code
    }
    catch (err) {
      const e = new MessageEmbed()
      .setColor(client.colors.red)
      .setThumbnail(client.user.displayAvatarURL())
      .addField("➜ Une erreur est survenue !", "```js\n" + err.message + "```")
      interaction.reply({ embeds: [e] })
      client.emit("error", err)
    }
  } 
}