const http = require("http")
const fs = require("fs")
const path = require("path")



// Create a local server to receive data from
const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, req.url === "/" ? "index.html" : "a.png")

  res.writeHead(200, {
    'Content-Type': req.url === "/" ? "text.html; charset=utf-8" : "image/png",
    "cache-control": "max-age=86400"
  });

  const fileStream = fs.createReadStream(filePath)
  return fileStream.pipe(res)
});

server.on("clientError", (err, socket) => {
  socket.end("http/1.1 400 Bad Request\r\n\r\n")
})

server.listen(8000, () => {
  console.log(`opened server on http://localhost:${server.address().port}`)
});
