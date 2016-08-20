'use strict';
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    title: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    assignedTo: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Card;
};