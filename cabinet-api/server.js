require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRoutes = require('./routes/contact');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/contact', contactRoutes);

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('✔︎ MongoDB connecté'))
	.catch((err) => console.error('✘ Erreur MongoDB :', err));

app.listen(port, () => {
	console.log(`⚡️ Serveur démarré sur http://localhost:${port}`);
});
