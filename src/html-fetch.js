const {URL} = require("url")
const {createWriteStream} = require("fs")
const {join} = require("path")
const request = require("request")
const cheerio = require("cheerio")

const tags = ["php", "Node.js", "MySQL"]

let horizon = tags.map(tag => new URL(`/wiki/${tag}`, "https://en.wikipedia.org").href)

request(horizon[0], (err, res, body) => {
  if (err) throw err;
  else if (res.statusCode !== 200) return console.log(res.statusCode)

  const $ = cheerio.load(body)
  let links = Array.from($("a"))

  horizon = horizon.concat(links.filter(link => {
    return /^\/wiki\/([^/]*)$/.test(link.attribs.href)
  }).map(linkNode => linkNode.attribs.href))

  function scrapeLinks(links) {
    request(links[0], (err, res, body) => {
      if (err) throw err;
      else if (res.statusCode !== 200) return console.log(res.statusCode)

      let newLinks = Array.from($("a"))

      links = links.concat(newLinks.filter(link => {
        return /^\/wiki\/([^/]*)$/.test(link.attribs.href)
      }).map(linkNode => linkNode.attribs.href))
        .map(slug => new URL(slug, "https://en.wikipedia.org").href)
      // console.log(links)

      iterate(links, scrapeLinks)
    })
  }

  iterate(horizon, scrapeLinks)
})
  .on("error", err => console.log(err))
  .pipe(createWriteStream(join(__dirname, "../html-data.html")))

// Utility function
function iterate(links, callback) {
  if (links.length === 0 || links.length === 100) return;

  callback(links.slice(1))
}

