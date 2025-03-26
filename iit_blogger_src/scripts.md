示例 1: 获取所有帖子
使用 curl 命令调用 GET /api/posts 接口：

示例 2: 获取特定帖子
使用 curl 命令调用 GET /api/posts/:id 接口，假设帖子 ID 为 1：

示例 3: 创建新帖子
使用 curl 命令调用 POST /api/posts 接口，发送 JSON 数据创建新帖子：

,
示例 4: 生成回复
使用 curl 命令调用 POST /api/generate-reply 接口，发送 JSON 数据生成回复：

Explanation:
获取所有帖子：

使用 curl -X GET http://localhost:3001/api/posts 获取所有帖子。
获取特定帖子：

使用 curl -X GET http://localhost:3001/api/posts/1 获取 ID 为 1 的帖子。
创建新帖子：

使用 curl -X POST http://localhost:3001/api/posts 并发送 JSON 数据创建新帖子。
使用 -H "Content-Type: application/json" 设置请求头为 JSON。
使用 -d 选项发送请求体数据。
生成回复：

使用 curl -X POST http://localhost:3001/api/generate-reply 并发送 JSON 数据生成回复。
通过这些示例，你应该能够使用 curl 命令调用本机的 /api 接口。如果遇到任何问题，请确保后端服务正在运行，并检查端口和 URL 是否正确。

### IP API

`curl -X GET http://ip-api.com/json/`

```json
{
  "status": "success",
  "country": "China",
  "countryCode": "CN",
  "region": "BJ",
  "regionName": "Beijing",
  "city": "Chaowai",
  "zip": "",
  "lat": 39.9564,
  "lon": 116.458,
  "timezone": "Asia/Shanghai",
  "isp": "CSTNET",
  "org": "BMW China Automotive Trading Ltd.",
  "as": "AS4808 China Unicom Beijing Province Network",
  "query": "122.200.123.101"
}
```
