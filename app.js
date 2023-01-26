const http = require('http');
const https = require('https');
const fs = require('fs');

const DateDiff = require('./DateDiff');
const logger = require('./logger')

require('dotenv').config();

const hostname = process.env.HOSTNAME
const port = process.env.PORT

const saveFilePath = process.env.SAVE_FILE_PATH
const hoursBetweenUpdates = process.env.HOURS_BETWEEN_UPDATES

const dataFetchOptions = {
    host: 'https://www.dtek-kem.com.ua',
    path: '/ua/shutdowns'
};

const server = http.createServer(async (req, res) => {
    logger.log("INFO", "Request incoming")

    if (!fs.existsSync(saveFilePath))
        await createNewSnapshot()

    snapshot = getSnapshotFromFile()
    if (DateDiff.inHours(snapshot.Date, new Date()) >= hoursBetweenUpdates) {
        logger.log("INFO", "Updating data file")
        await createNewSnapshot()
        snapshot = getSnapshotFromFile()
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(snapshot))
    res.end();
});

server.listen(port, hostname, () => {
    logger.log("INFO", `Server running at http://${hostname}:${port}/`)
});


function getSnapshotFromFile() {
    data = fs.readFileSync(saveFilePath);
    return JSON.parse(data)
}

async function createNewSnapshot() {
    logger.log("INFO", "Requesting data from source")
    const rawData = await httpGet()
    const parsedJson = parsePage(rawData)
    parsedJson.date = new Date()
    fs.writeFileSync(saveFilePath, JSON.stringify(parsedJson));
}

function parsePage(data) {
    logger.log("INFO", "Parsing data")
    const resultObject = {}
    for (i of data.split("DisconSchedule")) {
        i = i.trim()
        if (i.trim()[0] != '.') continue;
        rows = i.split('<')[0].split('=')

        if (rows.length != 2)
            throw new Error(`invalid parsing data - invalid row \n ${JSON.stringify({ input: data, row: i })}`, { input: data, row: i })

        propertyName = rows[0].split('.')[1]
        propertyValue = rows[1]
        resultObject[propertyName] = JSON.parse(propertyValue)
    }

    if (resultObject.preset == undefined)
        throw new Error(`invalid parsing data - result object is empty \n ${JSON.stringify({ input: data, output: resultObject })}` , { input: data, output: resultObject })

    return resultObject
}

function httpGet() {
    return new Promise((resolve, reject) => {
        data = ''
        https.get(dataFetchOptions.host + dataFetchOptions.path, (resp) => {

            resp.on('data', (chunk) => {
                data += chunk.toString();
            });

            resp.on('end', () => {
                resolve(data)
            });

        }).on("error", err => { reject(err) });
    })
}

