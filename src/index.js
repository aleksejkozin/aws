const express = require('express')
const fs = require('fs/promises')
const CronJob = require('cron').CronJob
const glob = require('fast-glob')
const lock = require('proper-lockfile').lock
var os = require('os');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Reporting
// new CronJob(
//   '*/1 * * * * *',
//   lock('reporting.queue', {stale: 60_000})
//     .then(async release => {
//       console.log('cron job')
//       await sleep(1000)
//       await release()
//     })
//     .catch(e => {
//       console.log('Skipping reporting: ', e)
//     }),
// ).start()

// Queue
// async function main() {
//   while (true) {
//     const [file] = await glob('q/*')
//     const release = await lock(file, {stale: 60_000})
//     const data = await fs.readFile(file, {encoding: 'utf8'}).then(JSON.parse)
//
//     await fs.writeFile(
//       file,
//       JSON.stringify({
//         ...data,
//         value: (data?.value ?? 0) + 1,
//       }),
//     )
//
//     await sleep(1000)
//     await release()
//   }
// }

// Web
const app = express()
app.get('/', (req, res) => {
  res.send(`Hello World! ${os.hostname()}`)
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`App started http://127.0.0.1:${port}`))
