const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulser un utilisateur')
        .addUserOption(option => option.setName('user').setDescription('Utilisateur à expulser').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Raison du kick').setRequired(false)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
        
        try {
            await interaction.guild.members.kick(user, reason);
            
            const embed = new EmbedBuilder()
                .setColor('#F59E0B')
                .setTitle('✅ Utilisateur expulsé')
                .addFields(
                    { name: 'Utilisateur', value: user.username },
                    { name: 'Raison', value: reason }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Erreur lors de l\'expulsion');
        }
    }
};
