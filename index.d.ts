import { CommandHandler, Listener, ListenerHandler } from "discord-akairo"
import { Collection, SlashCommandBuilder } from "discord.js";

declare namespace Mindicador {
	interface Uf {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface Ivp {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface Dolar {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface DolarIntercambio {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface Euro {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface Ipc {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface Utm {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface Imacec {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface Tpm {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface LibraCobre {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface TasaDesempleo {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface Bitcoin {
		codigo: string;
		nombre: string;
		unidad_medida: string;
		fecha: Date;
		valor: number;
	}

	interface Indicadores {
		version: string;
		autor: string;
		fecha: Date;
		uf: Uf;
		ivp: Ivp;
		dolar: Dolar;
		dolar_intercambio: DolarIntercambio;
		euro: Euro;
		ipc: Ipc;
		utm: Utm;
		imacec: Imacec;
		tpm: Tpm;
		libra_cobre: LibraCobre;
		tasa_desempleo: TasaDesempleo;
		bitcoin: Bitcoin;
	}
}

declare module 'discord.js' {
	interface SlashCommand {
		data: SlashCommandBuilder;
		execute: () => Promise<any>;
	}

	interface Client {
		privateChannel: TextChannel | null;
		developmentGuild: Guild | null;
		commands: Collection<string, SlashCommand>;
		listenerHandler: ListenerHandler;
		commandHandler: CommandHandler;
	}
}

declare namespace Phasmophobia {
	interface Ghost {
		id: string
		name: string
		evidences: Array<string>
		falseEvidences?: Array<string>
		hunt?: number
		url: string
		about: string
	}

	type Ghosts = Array<Ghost>
}

declare namespace Fuyumi {
	class CustomEvent extends Listener {
		hasTimers?: boolean
		clearTimers?: () => void
	}
}

declare namespace MyAnimeList {

	interface Data {
		node: {
			id: number
			title: string
			main_picture: {
				medium: string
				large: string
			}
		}
	}

	type GetAnimeListOptions = {
		q: string
		limit?: 4 | number,
		offset?: 0 | number,
		fields?: string
	}
	interface GetAnimeListResponse {
		data: Array<Data>
		paging: {
			next: string
		}
	}


	type GetAnimeDetailsOptions = {
		anime_id: number,
		fields?: string
	}

	interface Genre {
		id: number
		name: string
	}

	type NSFW = "white" | "gray" | "black" | null
	type AiringStatus = "finished_airing" | "currently_airing" | "not_yet_aired"
	type MediaType = "unknown" | "tv" | "ova" | "movie" | "special" | "ona" | "music"
	type SourceType = "other" | "original" | "manga" | "4_koma_manga" | "web_manga" | "digital_manga" | "novel" | "light_novel" | "visual_novel" | "game" | "card_game" | "book" | "picture_book" | "radio" | "music" | null
	type Rating = "g" | "pg" | "pg_13" | "r" | "r+" | "rx" | null
	interface GetAnimeDetailsResponse {
		id: number
		title: string
		main_picture: {
			medium: string
			large: string
		}
		alternative_titles: {
			synonyms: Array<string>
			en: string
			ja: string
		}
		start_date: string
		end_date: string
		synopsis: string
		mean: number
		rank: number
		popularity: number
		num_list_users: number
		num_scoring_users: number
		nsfw: NSFW
		created_at: string
		updated_at: string
		media_type: MediaType
		status: AiringStatus
		genres: Array<Genre>
		num_episodes: number
		start_season: {
			year: number
			season: string
		}
		broadcast: {
			day_of_the_week: string
			start_time: string
		}
		/** Basado en: manga */
		source: SourceType
		average_episode_duration: number
		rating: Rating
		pictures: Array<{
			medium: string
			large: string
		}>
		background: string
		studios: Array<{
			id: number
			name: string
		}>
	}
}