const colors = require("colors");

module.exports = async (client) => {
    console.log(colors.green("[BOT]") + ` ➜ Bot connecté à l'API de Discord en tant que ${colors.magenta(client.user.tag)}`)
    const activities = [`/help`, `Version ${client.version}`,'By Nolhan#2508', `${client.guilds.cache.size} serveurs`];
    await client.user.setActivity("Démarrage en cours...", { type: "STREAMING", url: "https://twitch.tv/discord" });
    setInterval(async () => {
        await client.user.setActivity(activities[Math.floor(Math.random() * activities.length)], { type: "STREAMING", url: "https://twitch.tv/discord" });
    }, 12000);
}