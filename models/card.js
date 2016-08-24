'use strict';
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    title: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    assignedTo: DataTypes.STRING,
    status: DataTypes.STRING
    // user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // models.Card.belongsTo(models.User, {
        //   foreignKey: 'user_id'
        // });
      }
    }
  });
  return Card;
};