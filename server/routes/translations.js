const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.get('/:lang', async (req, res) => {
    console.log(`Received request for translations. Language: ${req.params.lang}`);
    const { lang } = req.params;
    const supportedLanguages = ['en', 'es'];

    if (!supportedLanguages.includes(lang)) {
        console.log(`Unsupported language requested: ${lang}`);
        return res.status(400).json({ error: 'Unsupported language' });
    }

    try {
        const filePath = path.join(__dirname, '..', 'i18n', 'locales', `${lang}.json`);
        console.log(`Attempting to read translation file: ${filePath}`);
        const translations = await fs.readFile(filePath, 'utf8');
        console.log(`Successfully read translations for ${lang}`);
        res.json(JSON.parse(translations));
    } catch (error) {
        console.error(`Error reading translation file: ${error}`);
        res.status(500).json({ error: 'Failed to load translations' });
    }
});

module.exports = router;