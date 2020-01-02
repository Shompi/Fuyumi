
class BeatmapInfo {
  //Endpoint = get_beatmaps
  constructor(info) {
    this.beatmapid = info.beatmap_id;
    this.beatmapSetId = info.beatmapset_id;
    this.approved = info.approved;
    this.artist = info.artist;
    this.bpm = info.bpm;
    this.mapper = info.creator;
    this.stars = new Number(info.difficultyrating);
    this.totalLength = new Number(info.total_length);
    this.difficultyName = info.version;
    this.mode = info.mode;
    this.maxCombo = new Number(info.max_combo);
    this.circleSize = new Number(info.diff_size);
    this.approach = new Number(info.diff_approach);
    this.hpDrain = new Number(info.diff_drain);
    this.overall = new Number(info.diff_overall);
    this.title = info.title;
  }
}

class Profile {
  constructor(info) {
    this.id = info.user_id;
    this.username = info.username;
    this.playcount = new Number(info.playcount);
    this.pprank = new Number(info.pp_rank);
    this.accuracy = new Number(info.accuracy);
    this.level = new Number(info.level);
    this.country = info.country;
    this.countryRank = new Number(info.pp_country_rank);
    this.timestamp = new Date();
    this.pp = new Number(info.pp_raw);
  }
}

class Play {
  //get_user_recent
  constructor(info) {
    this.maxCombo = info.maxcombo;
    this.score = new Number(info.score);
    this.count50 = new Number(info.count50);
    this.count100 = new Number(info.count100);
    this.count300 = new Number(info.count300);
    this.countmiss = new Number(info.countmiss);
    this.countgeki = new Number(info.countgeki);
    this.countkatu = new Number(info.countkatu);
    this.perfect = new Boolean(info.perfect);
    this.mods = new Number(info.mods);
    this.rank = info.rank;
  }
}

class TopScore {
  //Endpoint: get_user_best
  constructor(topScore) {
    this.beatmap_id = topScore.beatmap_id;
    this.score = new Number(topScore.score);
    this.maxcombo = new Number(topScore.maxcombo);
    this.count300 = new Number(topScore.count300);
    this.count100 = new Number(topScore.count100);
    this.count50 = new Number(topScore.count100);
    this.misses = new Number(topScore.countmiss);
    this.katu = new Number(topScore.countkatu);
    this.geki = new Number(topScore.countgeki);
    this.prefect = new Boolean(topScore.perfect);
    this.mods = new Number(topScore.enabled_mods);
    this.date = new Date(topScore.date);
    this.pp = new Number(topScore.pp);
    this.rank = topScore.rank;
  }
}

module.exports = { BeatmapInfo, Play, TopScore, Profile }