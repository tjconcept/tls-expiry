console.error(`Looking up "${hostname}"…`)

const tcpConnection = await Deno.connect({port: 443, hostname})
const tlsConnection = await Deno.startTls(tcpConnection, {hostname})
const handshake = await tlsConnection.handshake()
tlsConnection.close()
