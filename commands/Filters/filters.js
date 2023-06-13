const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const emoji = require("../../settings/emoji.json");
const config = require("../../settings/config.json");
const { check_dj } = require("../../handlers/functions");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { default: DisTube, Queue } = require("distube");
const player = require("../../handlers/player");

module.exports = new Command({
  // options
  name: "filter",
  description: `adicione filtros na musica`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Filters",
  cooldown: 10,
  options: [
    {
      name: "8d",
      description: `Coloque efeito 8D`,
      type: "SUB_COMMAND",
    },
    {
      name: "bassboost",
      description: `Coloque Bassboost`,
      type: "SUB_COMMAND",
    },
    {
      name: "clear",
      description: `Tirar o filtro`,
      type: "SUB_COMMAND",
    },
    {
      name: "earrape",
      description: `DXA ESTOURADO PRA CARALHOKKKKKKK`,
      type: "SUB_COMMAND",
    },
    {
      name: "flanger",
      description: `Coloque flanger na musica`,
      type: "SUB_COMMAND",
    },
    {
      name: "gate",
      description: `Coloque gate na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "haas",
      description: `Coloque haas na musica`,
      type: "SUB_COMMAND",
    },
    {
      name: "heavybass",
      description: `Coloque heavybass na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "karaoke",
      description: `Coloque karaoke na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "lightbass",
      description: `Coloque lightbass na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "mcompad",
      description: `Coloque mcompad na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "nightcore",
      description: `Coloque nightcore na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "phaser",
      description: `Coloque phaser na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "pulsator",
      description: `Coloque pulsator na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "purebass",
      description: `Coloque purebass na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "reverse",
      description: `Coloque reverse na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "subboost",
      description: `Coloque subboost na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "surround",
      description: `Coloque surround na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "treble",
      description: `Coloque treble na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "tremolo",
      description: `Coloque tremolo na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "vaporware",
      description: `Coloque vaporware na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "vibrato",
      description: `Coloque vibrato na música`,
      type: "SUB_COMMAND",
    },
    {
      name: "custombassboost",
      description: `Coloque custombassboost na música`,
      type: "SUB_COMMAND",
      options: [
        {
          name: "amount",
          description: "give bass amount between 0 -20",
          type: "NUMBER",
          required: true,
        },
      ],
    },
    {
      name: "customspeed",
      description: `Add customspeed filter in Song`,
      type: "SUB_COMMAND",
      options: [
        {
          name: "amount",
          description: "give bass amount between 0 -2",
          type: "NUMBER",
          required: true,
        },
      ],
    },
  ],
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    const [subcmd] = args;
    switch (subcmd) {
      case "8d":
        {
          setFilter(client, interaction, player, "8d");
        }
        break;
      case "bassboost":
        {
          setFilter(client, interaction, player, "bassboost");
        }
        break;
      case "clear":
        {
          setFilter(client, interaction, player, false);
        }
        break;
      case "earrape":
        {
          setFilter(client, interaction, player, "earrape");
        }
        break;
      case "flanger":
        {
          setFilter(client, interaction, player, "flanger");
        }
        break;
      case "gate":
        {
          setFilter(client, interaction, player, "gate");
        }
        break;
      case "hass":
        {
          setFilter(client, interaction, player, "hass");
        }
        break;
      case "heavybass":
        {
          setFilter(client, interaction, player, "heavybass");
        }
        break;
      case "karaoke":
        {
          setFilter(client, interaction, player, "karaoke");
        }
        break;
      case "lightbass":
        {
          setFilter(client, interaction, player, "lightbass");
        }
        break;
      case "mcompad":
        {
          setFilter(client, interaction, player, "mcompad");
        }
        break;
      case "nightcore":
        {
          setFilter(client, interaction, player, "nightcore");
        }
        break;
      case "phaser":
        {
          setFilter(client, interaction, player, "phaser");
        }
        break;
      case "pulsator":
        {
          setFilter(client, interaction, player, "pulsator");
        }
        break;
      case "purebass":
        {
          setFilter(client, interaction, player, "purebass");
        }
        break;
      case "reverse":
        {
          setFilter(client, interaction, player, "reverse");
        }
        break;
      case "subboost":
        {
          setFilter(client, interaction, player, "subboost");
        }
        break;
      case "surround":
        {
          setFilter(client, interaction, player, "surround");
        }
        break;
      case "treble":
        {
          setFilter(client, interaction, player, "treble");
        }
        break;
      case "tremolo":
        {
          setFilter(client, interaction, player, "tremolo");
        }
        break;
      case "vaporware":
        {
          setFilter(client, interaction, player, "vaporware");
        }
        break;
      case "vibrato":
        {
          setFilter(client, interaction, player, "vibrato");
        }
        break;
      case "custombassboost":
        {
          let channel = interaction.member.voice.channel;
          let bass = interaction.options.getNumber("amount");
          let queue = player.getQueue(interaction.guild.id);
          if (!channel) {
            return client.embed(
              interaction,
              `** You Need to Join Voice Channel **`
            );
          } else if (
            interaction.guild.me.voice.channel &&
            !interaction.guild.me.voice.channel.equals(channel)
          ) {
            return client.embed(
              interaction,
              `** You Need to Join __ My Voice Channel __ **`
            );
          } else if (!queue.playing) {
            return client.embed(
              interaction,
              `** ${emoji.msg.ERROR} Nothing Playing Right Now **`
            );
          } else if (bass > 20 || bass < 0) {
            return client.embed(
              interaction,
              ` ** ${emoji.msg.ERROR} Custom BassBoost Limit is 0 - 20 **`
            );
          } else {
            let fns = `bass=g=${bass},dynaudnorm=f=200`;
            setFilter(client, interaction, player, fns);
          }
        }
        break;
      case "customspeed":
        {
          let channel = interaction.member.voice.channel;
          let bass = interaction.options.getNumber("amount");
          let queue = player.getQueue(interaction.guild.id);
          if (!channel) {
            return client.embed(
              interaction,
              `** You Need to Join Voice Channel **`
            );
          } else if (
            interaction.guild.me.voice.channel &&
            !interaction.guild.me.voice.channel.equals(channel)
          ) {
            return client.embed(
              interaction,
              `** You Need to Join __ My Voice Channel __ **`
            );
          } else if (!queue.playing) {
            return client.embed(
              interaction,
              `** ${emoji.msg.ERROR} Nothing Playing Right Now **`
            );
          } else if (bass <= 0 || bass > 2) {
            return client.embed(
              interaction,
              ` ** ${emoji.msg.ERROR} Custom BassBoost Limit is 0 - 2 **`
            );
          } else {
            let fns = `atempo=${bass}`;
            setFilter(client, interaction, player, fns);
          }
        }
        break;
      default:
        break;
    }
  },
});

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {DisTube} player
 * @param {Queue} queue
 * @param {String} filter
 * @returns
 */
async function setFilter(client, interaction, player, filter) {
  let channel = interaction.member.voice.channel;
  let queue = player.getQueue(interaction.guild.id);
  if (!channel) {
    return client.embed(interaction, `** You Need to Join Voice Channel **`);
  } else if (
    interaction.guild.me.voice.channel &&
    !interaction.guild.me.voice.channel.equals(channel)
  ) {
    return client.embed(
      interaction,
      `** You Need to Join __ My Voice Channel __ **`
    );
  } else if (!queue) {
    return client.embed(
      interaction,
      `** ${emoji.ERROR} Nothing Playing Right Now **`
    );
  } else if (check_dj(client, interaction.member, queue.songs[0])) {
    return interaction.followUp(
      `** ${emoji.ERROR} You are Not DJ and also not Song Requester **`
    );
  } else {
    await queue.setFilter(filter);
    return client.embed(
      interaction,
      `** ${emoji.SUCCESS} Added \`${filter}\` Filter in Song **`
    );
  }
}
