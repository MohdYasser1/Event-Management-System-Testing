const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RSVP = sequelize.define('RSVP', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Events',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'RSVPs',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

module.exports = RSVP;