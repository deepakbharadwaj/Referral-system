module.exports = (sequelize, Sequelize) => {
  const Linker = sequelize.define("linkers", {
    uid: {
      type: Sequelize.STRING
    },
    lid: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    reward: {
      type: Sequelize.NUMBER
    }
  });

  return Linker;
};
