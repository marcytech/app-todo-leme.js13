const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('api/db.json')
const middewares = jsonServer.defaults()

server.use(middewares)
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running 3000')
})
