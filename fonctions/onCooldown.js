  
  
  module.exports.onCoolDown = onCoolDown
  
  /**
   * 
   * @param {*} message A DiscordMessage, with the client, information
   * @param {*} command The Command with the command.name
   * @returns BOOLEAN
   */
  
   function onCoolDown(message, command) {
    if(!message || !message.client) throw "No Message with a valid DiscordClient granted as First Parameter";
    if(!command || !command.name) throw "No Command with a valid Name granted as Second Parameter";
    const client = message.client;
    if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
      client.cooldowns.set(command.name, new Collection());
    }
    const now = Date.now(); //get the current time
    const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
    const cooldownAmount = (command.cooldown || 0) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
    if (timestamps.has(message.member.id)) { //if the user is on cooldown
      const expirationTime = timestamps.get(message.member.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
      if (now < expirationTime) { //if he is still on cooldonw
        const timeLeft = (expirationTime - now) / 1000; //get the lefttime
        //return true
        return timeLeft
      }
      else {
        //if he is not on cooldown, set it to the cooldown
        timestamps.set(message.member.id, now); 
        //set a timeout function with the cooldown, so it gets deleted later on again
        setTimeout(() => timestamps.delete(message.member.id), cooldownAmount); 
        //return false aka not on cooldown
        return false;
      }
    }
    else {
      //if he is not on cooldown, set it to the cooldown
      timestamps.set(message.member.id, now); 
      //set a timeout function with the cooldown, so it gets deleted later on again
      setTimeout(() => timestamps.delete(message.member.id), cooldownAmount); 
      //return false aka not on cooldown
      return false;
    }
  }