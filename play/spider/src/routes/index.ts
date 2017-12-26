import * as async from 'async'
import * as cheerio from 'cheerio'
import * as Router from 'koa-router'
import * as superagent from 'superagent'
import * as url from 'url'
const router = new Router()

interface Item {
	title: string,
	href: string
}
const base = 'https://cnodejs.org/'
const urls: string[] = []
for (let i = 0; i < 30; i++) {
	urls.push('http://datasource_' + i)
}
let currentCount = 0
const fetchUrl = (u: string, callback: (a: any, url: string) => void) => {
	const delay = Math.floor((Math.random() * 10000000) % 2000)
	currentCount++
	console.log('现在的并发数是：', currentCount, ',正在抓取的是', url, ',耗时' + delay + '毫秒')
	setTimeout(() => {
		currentCount--;
		callback(null, url + ' html content')
	}, delay)
}

router.get('/', async (ctx, next) => {
	const items: Item[] = []
	const topicUrl: string[] = []
	try {
		const res = await superagent.get(base)
		const $ = cheerio.load(res.text)
		$('#topic_list .topic_title').each((idx, element) => {
			const $element = $(element)
			items.push({
				title: $element.attr('title'),
				href: $element.attr('href')
			})
			topicUrl.push(url.resolve(base, $element.attr('href')))
		})
		// ctx.body = items

		const promises = topicUrl.slice(0, 5).map(async tp => {
			const res2 = await superagent.get(tp)
			return [tp, res2.text]
		})
		const topics = await Promise.all(promises)
		let result: Array<{ title: string, href: string, comment1: string}>;
		result = topics.map((tp: string[]) => {
			const [topic, html] = tp
			const $2 = cheerio.load(html)
			return ({
				title: $2('.topic_full_title').text().trim(),
				href: topic,
				comment1: $2('.reply_content').eq(0).text().trim()
			})
		})

		ctx.body = result
	} catch (e) {
		ctx.body = e
	}
})

router.get('/async', async (ctx, next) => {
	const res = await new Promise(resolve => {
		async.mapLimit(urls, 5, (u, callback) => {
			fetchUrl(u, callback)
		}, (err, result) => {
			console.log('final')
			resolve(result)
		})
	})
	console.log(res)
	ctx.body = res
})

export default router
