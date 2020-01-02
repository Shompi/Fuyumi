const {Profile} = require('../../Classes/Osu')

module.exports = async (user = new Profile(), dbUser = new Profile()) => {
  function stringer(val = new Number(value)) {
    if (val > 0) return `+${val.toFixed(2)}`;
    if (val < 0) return `${val.toFixed(2)}`;
    return `Sin cambios`;
  }

  let newpp = stringer(user.pp - dbUser.pp);
  let newAcc = stringer(user.accuracy - dbUser.accuracy);
  let newLvl = stringer(user.level - dbUser.level);
  let newGlobal = stringer(dbUser.pprank - user.pprank);
  let newNacional = stringer(dbUser.countryRank - user.countryRank);
  let newPlayCount = stringer(user.playcount - dbUser.playcount);

  return {
    pp: newpp,
    accuracy: newAcc,
    level: newLvl,
    pprank: newGlobal,
    countryRank: newNacional,
    playcount: newPlayCount
  }

}