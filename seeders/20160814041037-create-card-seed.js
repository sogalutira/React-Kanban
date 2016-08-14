'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Cards', [{
      title : 'test',
      priority : 'low',
      created_by : 'testPerson',
      assigned_to: 'testPerson',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Cards');
  }
};
