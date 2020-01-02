class SearchResponse {
  constructor(response) {
    this.search = [
      {
        title: "",
        poster: "",
        synopsis: "",
        debut: null || "",
        type: "Pelicula" || "Anime" || "OVA",
        rating: 4.5,
        genres: [],
        episodes: [{
          nextEpisodeDate: null
        },
        {
          episode: 1,
          id: "16667/k-on-pelicula-1",
          imagePreview: "https://cdn.animeflv.net/screenshots/838/1/th_3.jpg"
        }]
      }
    ]
  }
}

module.exports = { SearchResponse };