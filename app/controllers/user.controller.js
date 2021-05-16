const db = require("../models");
const User = db.user;
const Lead = db.lead;
const Link = db.linker;

var UID = "";

const Op = db.Sequelize.Op;

exports.userProfile = (req, res) => {
  console.log(req.userId)
  User.findOne({
    where: {
      id: req.userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.submitLead = (req, res) => {
  // Save Lead to database
  User.findOne({
    where: {
      id: req.userId
    }
  }).then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      UID = user.id
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

  Lead.create({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address
  })
    .then( (lead) => {
      Link.create({
        uid: UID,
        lid: lead.id,
        status: "New",
        reward: "0"
      })
      res.send({ message: "Lead referred successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
