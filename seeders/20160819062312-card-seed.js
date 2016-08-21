'use strict';


module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Cards', [{
        title: 'Test',
        priority: 1,
        createdBy: 'Person1',
        assignedTo: 'Person1',
        createdAt : new Date(),
        updatedAt : new Date(),
        status: 'Queue',
        // user_id: 4
    }]
    );
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Cards');
  }
};
