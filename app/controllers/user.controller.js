const db = require("../models");
const User = db.user;
const Lead = db.lead;
const Link = db.linker;

const Op = db.Sequelize.Op;

function getDate(str1) {
  var dt1 = parseInt(str1.substring(0, 2));
  var mon1 = parseInt(str1.substring(3, 5));
  var yr1 = parseInt(str1.substring(6, 10));
  var date1 = new Date(yr1, mon1 - 1, dt1);
  return date1;
}

exports.userProfile = (req, res) => {
  User.findOne({
    where: {
      id: req.userId,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.submitLead = (req, res) => {
  var UID = "";
  // Save Lead to database
  User.findOne({
    where: { id: req.userId },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      UID = user.id;
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });

  Lead.create({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  })
    .then((lead) => {
      Link.create({
        uid: UID,
        lid: lead.id,
        status: "New",
        reward: "0",
      })
        .then(() => {
          res.send({ message: "Lead referred successfully!" });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.myLeads = (req, res) => {
  User.findOne({
    where: {
      id: req.userId,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      let startDate = new Date(0);
      let endDate = new Date();
      if (req.query != {}) {
        startDate = getDate(req.query.from);
        endDate = getDate(req.query.to);
      }
      Link.findAll({
        where: {
          uid: user.id,
          createdAt: { [Op.between]: [startDate, endDate] },
        },
      }).then((list) => {
        if (!list) {
          return res.status(404).send({ message: "No Leads found." });
        }
        Lead.findAll({
          raw: true,
        }).then((Leads) => {
          var LeadMap = {};
          var results = [];
          var total = 0;

          Leads.forEach((leadItem) => {
            LeadMap[leadItem.id] = leadItem.name;
          });

          list.forEach((listItem) => {
            var result = {};
            result.name = LeadMap[listItem.lid];
            result.reward = listItem.reward;
            result.status = listItem.status;
            total = total + parseInt(listItem.reward);
            results.push(result);
          });
          res.status(200).send({ results, total });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
