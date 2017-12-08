module.exports = {
	cookieSecret: 'u738*6do-yok^TG!we^47',
	sysCookieSecret: 'kie8u-Jki*iei^dlk-!pqxz',
	ssl: {
		windows_nt: {
			key: 'c:/nginx/ssl-cer/server.key',
			cert: 'c:/nginx/ssl-cer/server.crt'
		},
		linux: {
			key: '/usr/local/nginx/cert/214334684110204.key',
			cert: '/usr/local/nginx/cert/214334684110204.pem'
		},
		darwin: {
			key: '/usr/local/etc/nginx/ssl_cer/CA/server.key',
			cert: '/usr/local/etc/nginx/ssl_cer/CA/server.crt'
		}
	}
}