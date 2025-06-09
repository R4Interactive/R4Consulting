// server.js

// 0️⃣ Charger les variables d’environnement
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// 1️⃣ parser le JSON et les formulaires URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 2️⃣ CORS (si front et back ne sont pas sur le même domaine)
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

// 3️⃣ endpoint POST /api/contact
app.post('/api/contact', async (req, res) => {
	const { name, email, phone, subject, message } = req.body;

	// ⚠️ Validation basique
	if (!name || !email || !phone || !subject || !message) {
		return res.status(400).json({ error: 'Tous les champs sont requis.' });
	}

	try {
		// ⚙️ Configuration de votre transporteur
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST || 'smtp.hostinger.com',
			port: process.env.SMTP_PORT || 465,
			secure: true, // true si port 465
			auth: {
				user: process.env.SMTP_USER || 'contact@r4consulting.fr',
				pass: process.env.SMTP_PASS || 'C#7F/[>?nnKj',
			},
		});
		const info = await transporter.sendMail({
			from: '"Site R4 Consulting" <no-reply@r4consulting.fr>',
			to: 'contact@r4consulting.fr',
			subject: `Nouveau message de ${name} – ${subject}`,
			text: `
Nom : ${name}
E-mail : ${email}
Téléphone : ${phone}

Sujet : ${subject}

Message :
${message}
      `,
		});

		return res.json({ success: true, message: 'Message envoyé !' });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ error: 'Erreur serveur, réessayez plus tard.' });
	}
});

// 4️⃣ démarrage du serveur
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
