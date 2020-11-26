const DATABASE_URL = process.env.DATABASE_URL;
const db = require("knex")({ client: "pg", connection: DATABASE_URL });

const friendService = {
  getFriendCode(user_id) {
    return db("users")
      .select("friend_code")
      .where("user_id", user_id)
      .then((res) => res[0].friend_code)
      .catch((error) => console.log(error));
  },
  postNewFriendCode(user_id, friendCode) {
    return db("users")
      .where("user_id", user_id)
      .update("friend_code", friendCode);
  },
  updateFriendCode(user_id, friendCode) {},
  deleteFriendCode(user_id) {},
};

module.exports = friendService;
