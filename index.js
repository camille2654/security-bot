require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType, PresenceUpdateStatus } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// ===== CHARGER LES COMMANDES =====
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Commande chargée: ${command.data.name}`);
  } else {
    console.log(`⚠️  Commande ${file} n'a pas de 'data' ou 'execute'`);
  }
}

// ===== CHARGER LES ÉVÉNEMENTS =====
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
  console.log(`✅ Événement chargé: ${event.name}`);
}

// ===== ENREGISTRER LES SLASH COMMANDS =====
client.on('ready', async () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
  
  // 🟢 Mettre le bot en ligne (visible)
  await client.user.setPresence({
    activities: [{ name: '🛡️ Modération', type: ActivityType.Watching }],
    status: PresenceUpdateStatus.Online,
  });
  console.log('🟢 Statut: En ligne');
  
  try {
    const commands = client.commands.map(cmd => cmd.data.toJSON());
    await client.application.commands.set(commands);
    console.log(`✅ ${commands.length} commandes slash enregistrées`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement des commandes:', error);
  }
});

client.on('error', console.error);
client.on('warn', console.warn);

client.login(process.env.TOKEN);
