const sequelize = require('../config/db');

// Import all models
const User = require('./User');
const Event = require('./Event');
const RSVP = require('./RSVP');

// Define associations
User.hasMany(RSVP, { foreignKey: 'user_id', onDelete: 'CASCADE' });
RSVP.belongsTo(User, { foreignKey: 'user_id' });

Event.hasMany(RSVP, { foreignKey: 'event_id', onDelete: 'CASCADE' });
RSVP.belongsTo(Event, { foreignKey: 'event_id' });

module.exports = {
    sequelize,
    User,
    Event,
    RSVP,
};