const Discord = require("discord.js");
const friendService = require("../services/friendService");

module.exports = {
  name: "hosting",
  description: "host a raid",
  async execute(msg, args) {
    const userid = msg.author.id;
    let friendCode;
    try {
      const success = await friendService.getFriendCode(userid);
      if (!success) {
        return msg.reply("You don't have a friend code saved.");
      }
      friendCode = success;
    } catch (error) {
      console.log(error);
    }

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
      args.length < 3 ||
      args.length > 4 ||
      !isNaN(args[1]) ||
      isNaN(args[2]) ||
      isNaN(args[3])
    ) {
      return msg.reply(
        `\nPlease reply in the following format:\n\`\`\`\n!hosting <boss> <spots left> <time remaining>\`\`\`\nInclude spaces in your friend code.\nTime remaining is in minutes and is optional.\n\nExample:\n\`\`\`!host Darkrai 15 2342 3993 4002 4\`\`\``
      );
    }

    let boss = args[1].replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    let spotsOpen = args[2];
    let timeRemaining = args[3] || 30;

    if (!boss || !spotsOpen || !friendCode) {
      return msg.reply(
        `\nPlease reply in the following format:\n\`\`\`\n!hosting <boss> <spots left> <time remaining>\`\`\`\nInclude spaces in your friend code.\nTime remaining is in minutes and is optional.\n\nExample:\n\`\`\`!host Darkrai 15 2342 3993 4002 4\`\`\``
      );
    }

    if (spotsOpen == 0) {
      return msg.reply("Must have at least 1 spot available.");
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
