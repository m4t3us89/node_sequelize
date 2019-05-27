'use strict';
const DataTypes = require('sequelize/lib/data-types');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'profile', 
      {  
        type: DataTypes.STRING,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
