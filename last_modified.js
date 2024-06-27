const http = require("http")
const fs = require("fs")
const path = require("path")



// Create a local server to receive data from
const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, req.url === "/" ? "index.html" : "a.png")

  const stat = fs.statSync(filePath)

  const lastModified = stat.mtime.toUTCString()

  const header = {
    "Content-Type": req.url === "/" ? "text/html; charset=uft-8" : "image/png",
    "Last-Modified": lastModified
  }

  // 判断资源是否发生变化
  if (req.headers["if-modified-since"] === lastModified) {
    res.writeHead(304, header)
    res.end()
  } else {
    res.writeHead(200, header)
    const fileStream = fs.createReadStream(filePath)
    return fileStream.pipe(res)
  }
});

server.on("clientError", (err, socket) => {
  socket.end("http/1.1 400 Bad Request\r\n\r\n")
})

server.listen(8000, () => {
  console.log(`opened server on http://localhost:${server.address().port}`)
});
