const Discord = require("discord.js");

module.exports = {
  name: "hosting",
  description: "host a raid",
  execute(msg, args) {
    function getNickname(array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].id === msg.author.id) {
          let nickname = array[i].nickname;
          return nickname;
        }
      }
    }
    let guildMembers = msg.guild.members.cache.map((member, i) => {
      let rMember = {};
      rMember.nickname = member.nickname;
      rMember.id = i;
      return rMember;
    });

    //triggers to correct user-input
    if (
      args.length < 6 ||
      args.length > 7 ||
      !isNaN(args[1]) ||
      args[3].substring(0).length !== 4 ||
      args[4].substring(0).length !== 4 ||
      args[5].substring(0).length !== 4 ||
      isNaN(args[2]) ||
      isNaN(args[3]) ||
      isNaN(args[4]) ||
      isNaN(args[3] + args[4] + args[5])
    ) {
      return msg.reply(
        `\nPlease reply in the following format:\n\`\`\`\n!host <boss> <spots left> <friend code> <time remaining>\`\`\`\nInclude spaces in your friend code.\nTime remaining is in minutes and is optional.\n\nExample:\n\`\`\`!host Darkrai 15 2342 3993 4002 4\`\`\``
      );
    }

    let boss = args[1].replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    let spotsOpen = args[2];
    let friendCode = [args[3], args[4], args[5]].join(" ");
    let timeRemaining = args[6];

    if (!boss || !spotsOpen || !friendCode) {
      return msg.reply(
        `\nPlease reply in the following format:\n\`\`\`\n!host <boss> <spots left> <friend code> <time remaining>\`\`\`\nInclude spaces in your friend code.\nTime remaining is in minutes and is optional.\n\nExample:\n\`\`\`!host Darkrai 15 2342 3993 4002 4\`\`\``
      );
    }

    if (spotsOpen == 0) {
      return msg.reply("Must have at least 1 spot available.");
    }

    if (!timeRemaining) {
      timeRemaining = 30;
    }

    const messageEmbed = new Discord.MessageEmbed()
      .setColor("#ee1515")
      .setTitle(`Raid: **${boss}**`)
      .addFields([
        {
          name: "Host",
          value: `${getNickname(guildMembers) || msg.author} ${friendCode}`,
        },
        { name: "Spots Left", value: `${spotsOpen}` },
        { name: "Participants", value: [0] },
        { name: "Time Remaining", value: `${timeRemaining} minutes` },
      ]);

    return msg.channel
      .send(messageEmbed)
      .then((message) => {
        message.react("🕵️‍♂️");
        message.delete({ timeout: timeRemaining * 60 * 1000 });
      })
      .catch((error) => console.log(error));
  },
};
