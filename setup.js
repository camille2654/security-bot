const fs = require('fs');
const path = require('path');

// Crée les dossiers s'ils n'existent pas
const directories = ['commands', 'events', 'utils', 'config', 'data'];
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Dossier créé: ${dir}`);
    }
});

// Crée les fichiers JSON nécessaires
const dataDir = path.join(__dirname, 'data');
const filesNeeded = {
    'warnings.json': {},
    'modlogs.json': [],
    'mutes.json': {}
};

Object.entries(filesNeeded).forEach(([file, initialContent]) => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));
        console.log(`✅ Fichier créé: data/${file}`);
    }
});

console.log('✅ Structure du projet initialisée !');
