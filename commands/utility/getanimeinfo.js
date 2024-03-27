const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { themoviedb } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('animeinfo')
        .setDescription('Get information about an anime')
        .addStringOption(option =>
            option.setName('animename')
                .setDescription('Enter the anime name')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const headers = {
                'Authorization': `${themoviedb}`
            };

            const animename = interaction.options.getString('animename');
            const response = await axios.get(`https://api.themoviedb.org/3/search/tv?query=${animename}`, { headers });
            // const animeinfo = response.data;
            const animeInfo = response.data.results[0];

            // Construct the embed object
            const embed = {
                color: 0x0099ff,
                title: animeInfo.name,
                description: animeInfo.overview,
                fields: [
                    { name: "Year:", value: animeInfo.first_air_date.substring(0, 4), inline: true },
                    { name: "Original Name", value: animeInfo.original_name, inline: true },
                    // { name: "AniDB", value: `[Link](https://anidb.net/anime/${result.rows[0].id})`, inline: true }
                ],
                timestamp: new Date(),
                image: {
                    url: 'https://image.tmdb.org/t/p/w500'+animeInfo.poster_path
                },
                footer: {
                    text: 'Requested by ' + interaction.user.tag,
                }
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching anime info:', error);
            await interaction.reply('An error occurred while fetching anime info.');
        }
    },
};
