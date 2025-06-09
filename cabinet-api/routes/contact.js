const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
	console.log('Body reçu :', req.body); 
	const { name, email, message } = req.body;

	// Validation simple
	if (!name || !email || !message) {
		return res.status(400).json({ error: 'Tous les champs sont requis.' });
	}

	try {
		const contact = new Contact({ name, email, message });
		await contact.save();
		res.status(201).json({ success: true, message: 'Message envoyé !' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: 'Erreur serveur.' });
	}
});

module.exports = router;
