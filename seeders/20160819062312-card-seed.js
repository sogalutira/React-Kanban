'use strict';
 const faker = require('faker');

 const cardObj = [];
 for (var i = 0; i < 2; i++){
  const cardInfo = {
    title: faker.lorem.words(2),
    priority: 1,
    createdBy: faker.name.firstName(),
    assignedTo: faker.name.firstName(),
    createdAt : new Date(),
    updatedAt : new Date(),
    status: 'Queue'
    // user_id: faker.random.number({min: 1, max: 5})
  };
  cardObj.push(cardInfo);
 }

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Cards', cardObj, {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Cards');
  }
};
