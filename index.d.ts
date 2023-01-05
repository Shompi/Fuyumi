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
		evidences: string[]
		falseEvidences?: string[]
		hunt?: number
		url: string
		about: string
	}

	type Ghosts = Ghost[]
}

declare namespace Fuyumi {
	interface CustomEvent extends Listener {
		hasTimers: boolean
		clearTimers(): void
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
		data: Data[]
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

	interface GetAnimeDetailsResponse {
		id: number
		title: string
		main_picture: {
			medium: string
			large: string
		}
		alternative_titles: {
			synonyms: string[]
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
		nsfw: string
		created_at: string
		updated_at: string
		media_type: string
		status: string
		genres: Genre[]
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
		source: string
		average_episode_duration: number
		/** PG 13 */
		rating: string
		pictures: {
			medium: string
			large: string
		}[]
		background: string
		studios: {
			id: number
			name: string
		}[]
	}
}