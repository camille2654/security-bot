const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Avertir un utilisateur')
        .addUserOption(option => option.setName('user').setDescription('Utilisateur').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Raison').setRequired(false)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Aucune raison';
        
        try {
            const warningsPath = path.join(__dirname, '../data/warnings.json');
            let warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf-8'));
            
            if (!warnings[user.id]) warnings[user.id] = 0;
            warnings[user.id]++;
            
            fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));
            
            const embed = new EmbedBuilder()
                .setColor('#F59E0B')
                .setTitle('⚠️  Avertissement')
                .addFields(
                    { name: 'Utilisateur', value: user.username },
                    { name: 'Avertissements', value: `${warnings[user.id]}/5` },
                    { name: 'Raison', value: reason }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Erreur');
        }
    }
};
