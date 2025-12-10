const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Mettre en timeout un utilisateur')
        .addUserOption(option => option.setName('user').setDescription('Utilisateur').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Durée (5m, 1h, 1d)').setRequired(true)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');
        
        try {
            const member = await interaction.guild.members.fetch(user.id);
            const durationMs = parseDuration(duration);
            
            await member.timeout(durationMs);
            
            const embed = new EmbedBuilder()
                .setColor('#5B21B6')
                .setTitle('⏱️ Timeout appliqué')
                .addFields(
                    { name: 'Utilisateur', value: user.username },
                    { name: 'Durée', value: duration }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Erreur');
        }
    }
};

function parseDuration(str) {
    const units = { m: 60000, h: 3600000, d: 86400000 };
    const match = str.match(/^(\d+)([mhd])$/);
    return match ? parseInt(match[1]) * units[match[2]] : 0;
}
