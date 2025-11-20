const express = require('express');
const {Event} = require('../models');
const {RSVP} = require('../models');
const { isAdmin } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const {User} = require('../models');

const router = express.Router();

// Get all events
// Get all events
router.get('/', async (req, res) => {
    try{
        if(!req.headers.authorization) return res.status(401).json({error: "unauthorized"});

        const token = req.headers.authorization?.split(" ")[1];
        const payload = jwt.decode(token);
        const userId = payload.userId; 

        const events = await Event.findAll({
            include: [{
                model: RSVP,
                attributes: ['id'],
                where: { user_id: userId },
                required: false, // Left join to check RSVP status
            }],
        });

        const response = events.map(event => ({
            id: event.id,
            name: event.name,
            description: event.description,
            date: event.date,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            rsvped: event.RSVPs.length > 0, // Check if the user has RSVPed
        }));

        res.json(response);
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong!")
    }
});

// Create a new event
router.post('/', isAdmin, async (req, res) => {
    try{
        const event = await Event.create(req.body);
        res.status(201).json(event);
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong!")
    }
});

// RSVP to an event
router.post('/:id/rsvps', async (req, res) => {
    try{
        if(!req.headers.authorization) return res.status(401).json({error: "unauthorized"});

        const token = req.headers.authorization?.split(" ")[1];
        const payload = jwt.decode(token);
        const userId = payload.userId; 
        const eventId = req.params.id;
    

        // Ensure the event exists
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        // Create the RSVP
        const rsvp = await RSVP.create({ user_id: userId, event_id: eventId });
        res.status(201).json(rsvp);
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong!")
    }
});

// Get RSVPs for an Event (Admin Only)
router.get('/:eventId/rsvps', isAdmin, async (req, res) => {
    try{
        const { eventId } = req.params;

        // Ensure the event exists
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        // Retrieve RSVPs
        const rsvps = await RSVP.findAll({
            where: { EventId: eventId },
            include: [{ model: User, attributes: ['id', 'username', 'email'] }],
        });

        const response = rsvps.map(rsvp => ({
            userId: rsvp.User.id,
            username: rsvp.User.username,
            email: rsvp.User.email,
        }));

        res.json(response);
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong!")
    }
});

// Delete an Event (Admin Only)
router.delete('/:eventId', isAdmin, async (req, res) => {
    try{
        const { eventId } = req.params;

        // Ensure the event exists
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        // Delete the event
        await event.destroy();
        res.json({ message: "Event deleted successfully." });
    }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong!")
    }
});

module.exports = router;