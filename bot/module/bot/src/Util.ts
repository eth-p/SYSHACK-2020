import * as Discord from "discord.js";
import * as Long from "long";
import Context from "$bot/Context";
import {MessageEmbed, UserResolvable} from "discord.js";


/**
 * Reply to a message (ideally, privately).
 *
 * @param context The server context.
 * @param to The person/message to reply to.
 * @param message The message text to reply with.
 * @param alternative The alternative channel name.
 */
export async function reply(context: Context, to: Discord.Message | UserResolvable, message: string | MessageEmbed, alternative?: string): Promise<Discord.Message | Discord.Message[]> {
	const alt = (alternative == undefined) ? 'errors' : alternative;
	const user = to instanceof Discord.User ? to : await context.discord.users.fetch(
		typeof to === 'string' ? to : to.id
	);

	try {
		return await user.send(message);
	} catch (error) {
		let channel: Discord.TextChannel;

		if (typeof message === 'string') {
			message = `${to.toString()}: ${message}`;
		} else {
			message.setDescription(`${to.toString()}:\n\n${message.description}`);
		}

		channel = context.discord_server.channels.find(channel => channel.name == alternative && channel.type === 'text') as Discord.TextChannel;
		if (channel == null) channel = getDefaultChannel(context.discord_server);
		return await channel.send(message);
	}
}

export async function getName(context: Context, user: Discord.GuildMember|Discord.User|UserResolvable): Promise<string> {
	if (user instanceof Discord.GuildMember) {
		return user.nickname ?? (await context.discord.users.fetch(user.id)).username;
	}

	return getName(context, context.discord_server.member(user)!);
}

export function getDefaultChannel(server: Discord.Guild): Discord.TextChannel {
	// Try for the original channel ID.
	let channel = server.channels.get(server.id);
	if (channel != null) return channel as Discord.TextChannel;

	// Try for a general channel.
	channel = server.channels.find(channel => channel.name === "general" && channel.type === 'text');
	if (channel != null) return channel as Discord.TextChannel;

	// Try the fun stuff.
	return server.channels.filter(channel => channel.type === "text" && channel.permissionsFor(server.client.user!)!.has("SEND_MESSAGES"))
		.sort((a, b) => a.position - b.position || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
		.first() as Discord.TextChannel;
}
