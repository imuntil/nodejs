import dotenv from 'dotenv'
import path from 'path'

const config = dotenv.config({ path: path.resolve(__dirname, '../dev.env') })
console.log(`config`, config)

// =>
// config {
//   parsed: {
//     SOME_VAR: '1',
//     SOME_ORIGIN: 'local.com',
//     SOME_API_ORIGIN: 'api.local.com'
//   }
// }

console.log(`process.env`, process.env)

/**
 * =>
 * xxx: xxx
 * ...
 * ...
 * SOME_VAR: '1',
 * SOME_ORIGIN: 'local.com',
 * SOME_API_ORIGIN: 'api.local.com'
 */

console.log(`process.cwd()`, process.cwd())
