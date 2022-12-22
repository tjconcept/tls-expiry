#!/usr/bin/env node
import tls from 'node:tls'
import duration from 'duration'
import parse from 'minimist'

const args = parse(process.argv.slice(2))
const hostname = args._[0]

console.error(`Looking up "${hostname}"…`)

const certificate = await getCertificate(hostname)

console.log({
	expireIn: duration(new Date(), certificate.expire).toString(1, 3),
	issued: dateTimeFormat(certificate.issued),
	expire: dateTimeFormat(certificate.expire),
	issuer: certificate.issuer,
	fingerprint: certificate.fingerprint,
	subject: certificate.subject.CN,
	subjectaltname: certificate.subjectaltname,
	serial: certificate.serialNumber,
})

async function getCertificate(hostname) {
	const socket = tls.connect({
		host: hostname,
		port: 443,
		servername: hostname,
		rejectUnauthorized: false,
	})
	return new Promise((rs, rj) => {
		socket.on('error', (err) => rj(err))
		socket.on('secureConnect', () => {
			// socket.authorizationError
			const cert = socket.getPeerCertificate()
			rs({
				...cert,
				issued: new Date(cert.valid_from),
				expire: new Date(cert.valid_to),
			})
			socket.end()
		})
	})
}

function dateTimeFormat(date) {
	return `${[
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, '0'),
		String(date.getDate()).padStart(2, '0'),
	].join('-')} ${[
		String(date.getHours()).padStart(2, '0'),
		String(date.getMinutes()).padStart(2, '0'),
	].join(':')}`
}
