const friendService = require("../services/friendService");

module.exports = {
  name: "fc",
  description: "set and retrieve your friend code",
  execute(msg, args) {
    const mentionMap = msg.mentions.users.map((m) => {
      return m.user;
    });
    if (mentionMap.length > 0) {
      return;
    }

    if (!args[1]) {
      return;
    }
    const userid = msg.author.id;

    if (args[1].toLowerCase() == "set") {
      let codeCheck = args[3].split("-");
      if (
        !args[3] ||
        args[2].toLowerCase() !== "pogo" ||
        codeCheck.length !== 3 ||
        codeCheck[0].length !== 4 ||
        codeCheck[1].length !== 4 ||
        codeCheck[2].length !== 4
      ) {
        return msg.channel.send(
          `Set code with following format:\n\`\`\`\n!fc set pogo xxxx-xxxx-xxxx\`\`\``
        );
      } else {
        const friendCode = args[3];
        const codeExists = friendService.getFriendCode() || null;
        if (!codeExists) {
          try {
            friendService.updateFriendCode(userid, friendCode);
          } catch (error) {
            console.log(error);
            return msg.reply(
              "Something went wrong. Wait a minute and try again."
            );
          }

          return msg.reply("Friend code updated!");
        } else
          try {
            friendService.postNewFriendCode(userid, friendCode);
          } catch (error) {
            console.log(error);
            return msg.reply(
              "Something went wrong. Wait a minute and try again."
            );
          }

        return msg.reply("Friend code added!");
      }
    }

    if (args[1] && args[1].toLowerCase() == "delete") {
      msg.channel.send(args[3]);
    }
  },
};