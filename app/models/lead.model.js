module.exports = (sequelize, Sequelize) => {
  const Lead = sequelize.define("leads", {
    name: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
  });

  return Lead;
};
