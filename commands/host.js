const Discord = require("../node_modules/discord.js");

module.exports = {
  name: "host",
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

    let boss = args[1].replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    let spotsOpen = args[2];
    let friendCode = [args[3], args[4], args[5]].join(" ");
    let timeRemaining = args[6];

    if (!boss || !spotsOpen || !friendCode) {
      return msg.reply("Command should be..");
    }

    if (!timeRemaining) {
      timeRemaining = 1;
    }
    console.log(args, boss, spotsOpen, friendCode, timeRemaining);

    const messageEmbed = new Discord.MessageEmbed()
      .setColor("#ee1515")
      .setTitle(`Raid: **${boss}**`)
      .addFields([
        {
          name: "Host",
          value: `${getNickname(guildMembers)} ${friendCode}`,
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

    //edit msg to remove player when they react (and add spot open)
    //stop reactions when there's maximum players
    //format message to make it look pretty
    //event listener, maybe not on this command v
  },
};
