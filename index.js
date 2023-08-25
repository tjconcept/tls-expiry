console.error(`Looking up "${hostname}"…`)
const connection = await Deno.connectTls({port: 443, hostname})
const handshake = await connection.handshake()
connection.close()
