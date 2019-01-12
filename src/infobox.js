const parseRecord = require('./parseGames/_record')
const ordinal = /([0-9])(st|nd|rd|th)$/i

const toCardinal = function(str = '') {
  str = str.trim()
  if (ordinal.test(str)) {
    str = str.replace(ordinal, '$1')
    return Number(str)
  }
  if (/^[0-9]+$/.test(str)) {
    return Number(str)
  }
  return str
}

//
const parseInfobox = function(doc) {
  let info = doc.infobox('ice hockey team season')[0] || doc.infobox('NHLTeamSeason')[0]
  if (!info) {
    return {}
  }
  let data = info.keyValue()
  Object.keys(data).forEach((k) => {
    data[k] = toCardinal(data[k])
  })
  if (data.record) {
    data.record = parseRecord(data.record)
  }
  return data
}
module.exports = parseInfobox
