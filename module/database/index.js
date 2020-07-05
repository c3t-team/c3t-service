const { dbConfig } = require("../config");
const mongoose = require("mongoose");

const connect = async () => {
  await mongoose.connect(dbConfig.uri, {
    poolSize: dbConfig.poolSize,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  mongoose.set("useFindAndModify", false);
};

module.exports = { connect };
