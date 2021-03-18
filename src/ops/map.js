const OPS = require('./ops.json')

const map = {}
for (const op in OPS) {
  const code = OPS[op]
  map[code] = op
}

module.exports = map
