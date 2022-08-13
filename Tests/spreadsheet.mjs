import { GoogleSpreadsheet } from 'google-spreadsheet'

import {Collection, GatewayIntentBits} from "discord.js"
const docId = "1-gwkASclYdIXWiMpTfvWAdLnKUpE4Aa92VCcRRiUCUY"

const document = new GoogleSpreadsheet(docId)

document.useApiKey('AIzaSyDYsvsDqa4fzIOGc5LM4hi-C7NvC3McPms')

await document.loadInfo().catch(console.error)

const sheet = document.sheetsByIndex[2]

console.log(sheet.title)
console.log(sheet.rowCount);