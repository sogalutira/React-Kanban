'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Priorities', [{
      priority : '1',
      tasks: 'clean',
      createdAt : new Date(),
      updatedAt : new Date(),
    }], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Priorities');
  }
};
