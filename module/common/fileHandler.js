const fs = require("fs") // Or `import fs from "fs";` with ESM

const validateFilePath = (path) => {
  if (!fs.existsSync(path)) throw new Error('File path is not existed ' + path)
}
module.exports = {validateFilePath}
