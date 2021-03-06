require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client({
  partials: ["USER", "REACTION", "GUILD_MEMBER"],
});
bot.commands = new Discord.Collection();
const botCommands = require("./commands/");
const TOKEN = process.env.TOKEN;

Object.keys(botCommands).map((key) => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (msg) => {
  if (msg.author.bot) {
    return;
  }

  let args;
  let command;

  if (!msg.content.startsWith("!")) {
    return;
  }

  if (msg.content.startsWith("!")) {
    args = msg.content.split(" ");
    command = args[0].toLowerCase().toString().slice(1, args[0].length);
  }

  if (!bot.commands.has(command)) {
    return;
  }

  try {
    bot.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
  }
});

bot.on("messageReactionAdd", (reaction, user) => {
  // let time = reaction.message.createdTimestamp;
  // let currentTime = new Date().getTime();
  // console.log(time - currentTime);
  // function findTime() {}

  if (
    reaction.message.reactions.cache.size > 1 &&
    reaction.message.author.id == "773710233977618464"
  ) {
    reaction.remove();
  }

  function getNickname(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === user.id) {
        let nickname = array[i].nickname;
        return nickname;
      }
    }
  }

  if (
    reaction.emoji.name === "🕵️‍♂️" &&
    reaction.message.author.id !== "773710233977618464"
  ) {
    return;
  }

  if (
    reaction.emoji.name === "🕵️‍♂️" &&
    reaction.message.author.bot &&
    user.id !== "773710233977618464"
  ) {
    if (reaction.message.embeds.length < 1 && reaction.message.author.bot) {
      return;
    }

    const spotsLeft = reaction.message.embeds[0].fields[1].value;

    if (spotsLeft == 0) {
      return reaction.users.remove(user.id);
    }

    let newEmbed = reaction.message.embeds[0];

    let guildMembers = reaction.message.guild.members.cache.map((member, i) => {
      let rMember = {};
      rMember.nickname = member.nickname;
      rMember.id = i;
      return rMember;
    });

    let newParticipant = getNickname(guildMembers) || user.tag;
    if (newEmbed.fields[2].value[0] == "0") {
      newEmbed.fields[2].value = [
        `${newEmbed.fields[2].value.length}. ${newParticipant}`,
      ];
    } else {
      let participants = newEmbed.fields[2].value;
      let num =
        typeof participants === "string" ? participants.split("\n").length : 0;
      let newEntry = `\n${num + 1}. ${newParticipant}`;
      participants += newEntry;

      newEmbed.fields[2] = { name: "Participants", value: participants };
    }

    newEmbed.fields[1] = {
      name: "Spots Left",
      value: newEmbed.fields[1].value - 1,
    };
    let newEmbedObj = new Discord.MessageEmbed(newEmbed);
    if (newEmbed.fields[1].value == 0) {
      let hostValue = newEmbed.fields[0].value;
      let hostSplit = hostValue.slice(0, -15);
      const guildMap = reaction.message.guild.members.cache.map((m) => {
        return m;
      });

      let host = guildMap.find((user) => user.nickname == hostSplit) || null;

      if (host) {
        let searchableListValue = newEmbed.fields[2].value;
        let searchableListSplit = searchableListValue.split(/[\n.]/) || null;
        if (searchableListSplit) {
          let searchableListFilter = searchableListSplit.filter((item) =>
            isNaN(parseInt(item))
          );
          let searchableList = searchableListFilter.join();
          host.send(searchableList);
        }
      }
    }
    return reaction.message.edit(newEmbedObj);
  }
});

bot.on("messageReactionRemove", (reaction, user) => {
  const spotsLeft = reaction.message.embeds[0].fields[1].value;
  const userLength = reaction.message.embeds[0].fields[2].value.split("\n");

  const checkNum = userLength.length + 1;

  if (spotsLeft == 0 && reaction.count == checkNum) {
    return;
  }

  function getNickname(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === user.id) {
        let nickname = array[i].nickname;
        return nickname;
      }
    }
  }

  function newArray(array) {
    let newUserListArray = [];

    for (let i = 0; i < array.length; i++) {
      let newEntry = `${i + 1}. ${array[i]}`;

      newUserListArray.push(newEntry);
    }
    return newUserListArray;
  }

  if (
    reaction.emoji.name === "🕵️‍♂️" &&
    reaction.message.author.bot &&
    user.id !== "773710233977618464"
  ) {
    let newEmbed = reaction.message.embeds[0];

    let guildMembers = reaction.message.guild.members.cache.map((member, i) => {
      let rMember = {};
      rMember.nickname = member.nickname;
      rMember.id = i;
      return rMember;
    });

    let oldParticipant = getNickname(guildMembers) || user.tag;

    const userList = newEmbed.fields[2].value.split("\n");
    const newUserList = userList.filter(
      (participant) => !participant.includes(oldParticipant)
    );

    const newUserListUnnumber = newUserList.map((participant) => {
      const rParticipant = participant.substring(3);

      return rParticipant;
    });
    const newUserListArray = newArray(newUserListUnnumber);

    const newUserListJoined = newUserListArray.join("\n");

    newEmbed.fields[2].value = newUserListJoined || 0;

    newEmbed.fields[1] = {
      name: "Spots Left",
      value: parseInt(newEmbed.fields[1].value) + 1,
    };
    let newEmbedObj = new Discord.MessageEmbed(newEmbed);
    return reaction.message.edit(newEmbedObj);
  }
});
