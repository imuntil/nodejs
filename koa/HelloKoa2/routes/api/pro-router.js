const router = require('koa-router')()
const proController = require('../../app/controllers/product-controller')
const ApiError = require('../../app/error/ApiError')
const ApiErrorNames = require('../../app/error/ApiErrorNames')
const multer = require('koa-multer')
const path = require('path')
const fs = require('fs')

const dataDir = path.resolve(__dirname, '../../public/') + '/images'
const proPics = dataDir + '/pro-pics'
fs.existsSync(dataDir) || fs.mkdirSync(dataDir)
fs.existsSync(proPics) || fs.mkdirSync(proPics)

const storage = multer.diskStorage({
	destination (req, file, cb) {
		const p = proPics + '/' + req.sku
		fs.existsSync(p) || fs.mkdirSync(p)
		cb(null, p)
	},
	filename (req, file, cb) {
		const fileFormat = (file.originalname).split('.')
		cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
	}
})
const upload = multer({
	storage,
	fileFilter (req, file, cb) {
		const m = req.url.match(/api\/pros\/([A-z]{1}-\d{3,4})\/upload/)
		if (m && m[1]) {
			req.sku = m[1].toUpperCase()
			return cb(null, true)
		}
		cb(new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR))
	}
})

router
	// sys
	.post('/sys/add', proController.addPro)
	.get('/maybe', proController.maybeLike)
	.post('/:sku/upload', upload.single('file'), proController.productImage)
	// .post('/:sku/upload', upload.array('file', { maxCount: 5 }), proController.productImage)
	// sys only
	.put('/sys/:sku', proController.modifyPro)
	// sys only
	.delete('/sys/:sku', proController.delPro)
	// sys
	.get('/(sys)?/', proController.getProList)
	// sys
	.get('/(sys)?/:sku', proController.getProDetail)

module.exports = router