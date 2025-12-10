const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir un utilisateur')
        .addUserOption(option => option.setName('user').setDescription('Utilisateur à bannir').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Raison du ban').setRequired(false)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
        
        try {
            await interaction.guild.members.ban(user, { reason });
            
            const embed = new EmbedBuilder()
                .setColor('#EF4444')
                .setTitle('✅ Utilisateur banni')
                .addFields(
                    { name: 'Utilisateur', value: user.username },
                    { name: 'Raison', value: reason }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Erreur lors du bannissement');
        }
    }
};
