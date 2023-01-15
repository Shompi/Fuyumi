/**
	This script was made by
	@MixDevCode
	and Typed by
	@Shompi
 */

import cloudscraper from 'cloudscraper';
import { load } from 'cheerio';

interface ScraperOptions {
	headers: {
		[key: string]: string
	},
	uri?: string
}

export interface PartialAnimeData {
	title: string
	cover: string
	synopsis: string
	id: string
	type: string
	url: string
}

export interface AnimeData {
	title: string
	alternative_titles: string[]
	status: string
	rating: string
	type: string
	cover: string
	synopsis: string
	genres: string[]
	episodes: number
	url: string
}

let options: ScraperOptions = {
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		'Cache-Control': 'private',
		'Referer': 'https://www.google.com/search?q=animeflv',
		'Connection': 'keep-alive',
	}
}

export async function searchAnime(query: string): Promise<PartialAnimeData[]> {
	options.uri = 'https://www3.animeflv.net/browse?q=' + query.toLowerCase().replace(/ /g, "+")

	/**
		@todo Aún no se estan controlando los 404, se debería chequear por 404 luego de un request y devolver un valor adecuado.
	 */
	const searchData = await cloudscraper(options)

	const $ = load(searchData)

	let search: PartialAnimeData[] = []
	if ($('body > div.Wrapper > div > div > main > ul > li').length > 0) {
		$('body > div.Wrapper > div > div > main > ul > li').each((i, el) => {
			let temp = {
				title: $(el).find('h3').text(),
				cover: $(el).find('figure > img').attr('src'),
				synopsis: $(el).find('div.Description > p').eq(1).text(),
				id: $(el).find('a').attr('href').replace("/anime/", ""),
				type: $(el).find('a > div > span.Type').text(),
				url: 'https://www3.animeflv.net/anime/' + $(el).find('a').attr('href')
			}

			search.push(temp);
		});
	};
	return search;
}

export async function getAnimeInfo(anime: string): Promise<AnimeData> {

	let animeSearch = await searchAnime(anime);

	if (animeSearch.length == 0) return null;

	options.uri = 'https://www3.animeflv.net/anime/' + animeSearch[0].id;
	const animeData = await cloudscraper(options);
	const $ = load(animeData);

	let animeInfo: AnimeData = {
		title: $('body > div.Wrapper > div > div > div.Ficha.fchlt > div.Container > h1').text(),
		alternative_titles: [],
		status: $('body > div.Wrapper > div > div > div.Container > div > aside > p > span').text(),
		rating: $('#votes_prmd').text(),
		type: $('body > div.Wrapper > div > div > div.Ficha.fchlt > div.Container > span').text(),
		cover: 'https://animeflv.net' + $('body > div.Wrapper > div > div > div.Container > div > aside > div.AnimeCover > div > figure > img').attr('src'),
		synopsis: $('body > div.Wrapper > div > div > div.Container > div > main > section:nth-child(1) > div.Description > p').text(),
		genres: $('body > div.Wrapper > div > div > div.Container > div > main > section:nth-child(1) > nav > a').text().split(/(?=[A-Z])/),
		episodes: JSON.parse($('script').eq(15).text().match(/episodes = (\[\[.*\].*])/)[1]).length,
		url: 'https://www3.animeflv.net/anime/' + animeSearch[0].id
	};
	$('body > div.Wrapper > div > div > div.Ficha.fchlt > div.Container > div:nth-child(3) > span').each((i, el) => {
		animeInfo.alternative_titles.push($(el).text());
	})
	return animeInfo;
}