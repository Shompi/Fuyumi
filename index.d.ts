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

declare module 'tioanime' {

	interface SearchResult {
		id: string
		title: string
		poster: string
	}

	interface Episode {
		id: string
		poster: string
		episode: number
		date: string
	}

	interface AnimeInfoResult {
		id: string
		malId: string
		title: string
		poster: string
		banner: string
		synopsis: string
		debut: string
		type: string
		genres: string[]
		nextEpisode?: string
		episodes: Episode[]
	}

	function search(query: string): Promise<SearchResult[]>
	function getAnimeInfo(query: string): Promise<AnimeInfoResult[]>

}