const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const { MessageEmbed } = require("discord.js");
const emoji = require('../../settings/emoji.json')

module.exports = new Command({
  // options
  name: "invite",
  description: `get invite link of bot`,
  userPermissions: ['SEND_MESSAGES'],
  botPermissions: ['SEND_MESSAGES'],
  category: "Information",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    interaction.followUp({embeds : [
        new MessageEmbed()
        .setColor(ee.color)
        .setTitle(` 💌 Thanks for Inviting me..`)
        .setDescription(`>>> ** [Click here to Invite](https://discord.com/api/oauth2/authorize?client_id=935182582537146368&permissions=8&scope=bot%20applications.commands) **`)
        .setFooter({text : ee.footertext , iconURL : ee.footericon})
    ]})
  },
});
