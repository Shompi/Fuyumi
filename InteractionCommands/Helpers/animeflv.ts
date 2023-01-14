/**
	* This script was provided to me by
	* @MixDevCode
	* and typed by
	* @Shompi
 */

import cloudscraper from "cloudscraper"
import { load } from "cheerio"

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
	type: string
	url: string
}

export interface AnimeData {
	title: string
	alternative_title?: string
	status: string
	cover: string
	synopsis: string
	genres: Array<string>
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


export async function searchAnime(anime: string): Promise<Array<PartialAnimeData>> {
	options.uri = 'https://www3.animeflv.net/browse?q=' + anime.toLowerCase().replace(/ /g, "+")
	const searchData = await cloudscraper(options)
	const $ = load(searchData)

	let search: Array<PartialAnimeData> = []

	$('body > div.Wrapper > div > div > main > ul > li').each((i, el) => {

		let temp = {
			title: $(el).find('h3').text(),
			cover: $(el).find('figure > img').attr('src'),
			synopsis: $(el).find('div.Description > p').eq(1).text(),
			type: $(el).find('a > div > span.Type.tv').text(),
			url: 'https://animeflv.net' + $(el).find('a').attr('href')
		}

		search.push(temp)

	})
	return search
}

export async function getAnimeInfo(anime: string): Promise<AnimeData> {

	options.uri = 'https://www3.animeflv.net/anime/' + anime.toLowerCase().replace(/[^a-zA-Z 0-9]+/g, '').replace(/ /g, "-")

	const animeData = await cloudscraper(options)
	const $ = load(animeData)

	let animeInfo = {
		title: $('body > div.Wrapper > div > div > div.Ficha.fchlt > div.Container > h1').text(),
		alternative_title: $('body > div.Wrapper > div > div > div.Ficha.fchlt > div.Container > div:nth-child(3) > span').text(),
		status: $('body > div.Wrapper > div > div > div.Container > div > aside > p > span').text(),
		cover: 'https://animeflv.net' + $('body > div.Wrapper > div > div > div.Container > div > aside > div.AnimeCover > div > figure > img').attr('src'),
		synopsis: $('body > div.Wrapper > div > div > div.Container > div > main > section:nth-child(1) > div.Description > p').text(),
		genres: $('body > div.Wrapper > div > div > div.Container > div > main > section:nth-child(1) > nav > a').text().split(/(?=[A-Z])/),
		episodes: JSON.parse($('script').eq(15).text().match(/episodes = (\[\[.*\].*])/)[1]).length,
		url: 'https://www3.animeflv.net/anime/' + anime.toLowerCase().replace(/[^a-zA-Z 0-9]+/g, '').replace(/ /g, "-")
	}

	return animeInfo
}
