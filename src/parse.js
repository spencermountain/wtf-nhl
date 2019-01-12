const parseGames = require('./parseGames')
const parseInfobox = require('./infobox')

const parseTitle = function(season = '') {
  let num = season.match(/[0-9]+/) || []
  let year = Number(num[0]) || season
  let team = season.replace(/[0-9\-–]+/, '').replace(/_/g, ' ').replace(' season', '')
  return {
    year: year,
    season: season,
    team: team.trim()
  }
}

const parseRoster = function(doc) {
  let s = doc.sections('skaters') || doc.sections('roster') || doc.sections('player statistics')
  let players = []
  if (!s) {
    return players
  }
  //do all subsections, too
  let tables = s.tables()
  s.children().forEach(c => {
    tables = tables.concat(c.tables())
  })
  if (!tables[0]) {
    return players
  }
  players = tables[0].keyValue().map((o) => {
    let name = o.Player || ''
    name = name.replace(/\(.*?\)/, '')
    name = name.replace(/[‡†]/, '')
    name = name.trim()
    return {
      name: name,
      games: Number(o.GP || 0),
      goals: Number(o.G || 0),
      assists: Number(o.A || 0),
      points: Number(o.Pts || o.PTS || o.Points) || 0,
      plusMinus: Number(o['+/−']) || 0,
    }
  })
  players = players.filter((o) => o && o.name && o.name !== 'Total')
  return players
}

//
const parse = function(doc) {
  let res = {
    title: parseTitle(doc.title()),
    roster: parseRoster(doc),
    season: parseInfobox(doc)
  }
  res.games = parseGames(doc, res.title)
  return res
}
module.exports = parse
