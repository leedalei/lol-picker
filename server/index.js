const Koa = require('koa'),
  route = require('koa-route'),
  websockify = require('koa-websocket');
const koaBody = require('koa-body').default;
const jwt = require('koa-jwt');
const jsonwebtoken = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const heroList = require("./config")
const util = require("./util")

const uuid = require("uuid")
const Pool = require("./module/Pool")
const Game = require("./module/Game")
const Room = require("./module/Room")
const Player = require("./module/Player")

const uri = "mongodb://127.0.0.1:27017/lol?retryWrites=true&w=majority";
const client = new MongoClient(uri);
async function initDB() {
  try {
    console.log('数据库链接成功！')
    client.connect();
  } catch (error) {
    console.log('链接数据库失败：', error.message)
    client.close()
  }
}
initDB()

const connectPool = {}

const secret = 'leelei';

const app = websockify(new Koa());
const pool = new Pool()

const onOkWithData = (data) => {
  return {
    success: true,
    data: data || null,
    message: 'ok'
  }
}

const onFailWithMessage = (message) => {
  return {
    success: false,
    data: null,
    message
  }
}

app.use(koaBody());
// app.use(jwt({ secret }).unless({ path: [/^\/api\/login/] }));

app.use(route.post("/api/login", async function (ctx) {
  const body = ctx.request.body
  console.log(ctx.request.body)
  console.log('---')
  if (!body.userName) {
    ctx.body = (onFailWithMessage("没有名字啊 草泥马啊"))
  } else {
    const collection = client.db("lol").collection("user")
    const id = uuid.v4()
    await collection.insertOne({
      name: body.userName,
      id,
      roomId: "",
      dice: 0,
      isReady: false,
      team: ""
    })
    ctx.body = onOkWithData(id)
  }
}))

app.use(route.get("/api/room", async  function (ctx) {
  try {
    const userId = ctx.header.player
    const roomId = ctx.query.id
    const data = await getRoomInfo(userId, roomId)
    ctx.body = onOkWithData(data)
  } catch (error) {
    ctx.body = onFailWithMessage(error.message)
  }
}))

app.use(route.get("/api/game/:id", function (ctx) {
  const gameId = ctx.params.id
  
  ctx.body = onOkWithData(d)
}))

// Regular middleware
// Note it's app.ws.use and not app.use
app.ws.use(function (ctx, next) {
  // return `next` to pass the context (ctx) on to the next ws middleware
  return next(ctx);
});

async function getRoomInfo(userId, roomId ) {
  const userCollection = client.db("lol").collection("user")
  const user = await userCollection.findOne({ id: userId })

  const userList = await userCollection.find({ roomId }).toArray()

  const gameCollection = client.db("lol").collection("game")
  const game = await gameCollection.findOne({ roomId, status: { $in: ["INIT", "PLAYING"] } })

  return {
    id: user.roomId,
    userList,
    game: game ? {
      id: game.id,
      status: game.status,
      roomId: game.roomId,
      heroList: user.team === "RED" ? game.redHeroList : game.blueHeroList
    } : null
  }
}

async function notify(roomId) {
  const userCollection = client.db("lol").collection("user")
  const userList = await userCollection.find({ roomId }).toArray()

  const gameCollection = client.db("lol").collection("game")
  const game = await gameCollection.findOne({ roomId, status: { $in: ["INIT", "PLAYING"] } })

  for (const user of userList) {
    console.log('正在通知：', user.id, connectPool[user.id] === true, Object.keys(connectPool).length, "个通信在池子里。")
    connectPool[user.id]?.send(JSON.stringify({
      type: "ROOM_INFO",
      data: {
        id: roomId,
        userList,
        game: game ? {
          id: game.id,
          status: game.status,
          roomId: game.roomId,
          heroList: user.team === "RED" ? game.redHeroList : game.blueHeroList
        } : null
      }
    }))
  }
}

async function createRoom(userId) {
  const collection = client.db("lol").collection("room")
  const newRoom = {
    id: uuid.v4(),
  }
  await collection.insertOne(newRoom)

  const userCollection = client.db("lol").collection("user")
  const query = { id: userId };
  await userCollection.updateOne(query, {$set: {roomId: newRoom.id}});
  return newRoom
}

async function joinRoom(userId, roomId) {
  const collection = client.db("lol").collection("user")
  const query = { id: userId };
  const docs = await collection.updateOne(query, {$set: {roomId}});
}

async function exitRoom(userId){
  const collection = client.db("lol").collection("user")
  const query = { id: userId };
  const docs = await collection.updateOne(query, {$set: {roomId: ""}});
}

async function joinTeam(userId, team) {
  const collection = client.db("lol").collection("user")
  const query = { id: userId };
  await collection.updateOne(query, { $set: { team } });
}

async function createGame(roomId) {
  const collection = client.db("lol").collection("game")
  const max = 24
  const all = util.getRandomElements(heroList, max)
  const newGame = ({
    id: uuid.v4(),
    status: "INIT",
    roomId,
    redHeroList: all.slice(0, max / 2),
    blueHeroList: all.slice(max / 2),
    allHeroList: all
  })
  await collection.insertOne(newGame)
  return newGame
}

async function updateGameStatus(gameId, status) {
  const collection = client.db("lol").collection("game")
  const query = ({
    id: gameId,
  })
  await collection.updateOne(query, { $set: { status } })
}

// Using routes
app.ws.use(route.all('/api/connect/:id', function (ctx) {
  // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
  // the websocket is added to the context on `ctx.websocket`.
  // console.log(ctx.request.path)
  ctx.websocket.send(JSON.stringify({ data: "Hello" }));
  ctx.websocket.on('message', async function (message) {
    try {
      const data = JSON.parse(message.toString())
      const roomId = data?.roomId
      // operation id 
      const curUser = pool.getPlayer(data.id)
      connectPool[data.id] = ctx.websocket

      switch (data.operation) {
        case "CREATE_ROOM": {
          console.log('创建房间')
          const room = await createRoom(data.id)
          ctx.websocket.send(JSON.stringify({ type: 'CREATE_ROOM_RET', data: room.id }))
          notify(room.id)
          break;
        }
        case "JOIN_ROOM": {
          console.log('加入房间')
          await joinRoom(data.id, data.roomId)
          ctx.websocket.send(JSON.stringify({ type: 'JOIN_ROOM_RET', data: data.roomId }))
          notify(data.roomId)
          break;
        }
        case "EXIT_ROOM": {
          console.log('退出房间')
          exitRoom()
          notify(data.roomId)
          break
        }
        case "ROLL": {
          console.log('随机英雄')
          curUser.roll()
          break;
        }
        case "JOIN_RED": {
          console.log('加入红队')
          await joinTeam(data.id, "RED")
          notify(data.roomId)
          break
        }
        case "JOIN_BLUE": {
          console.log('加入蓝队')
          await joinTeam(data.id, "BLUE")
          notify(data.roomId)
          break
        }
        case "CREATE_GAME": {
          console.log('发起游戏')
          await createGame(data.roomId)
          notify(data.roomId)
          break
        }
        case "START_GAME": {
          console.log('开始游戏')
          await updateGameStatus(data.gameId, "PLAYING")
          notify(data.roomId)
          break
        }
        case "END_GAME": {
          console.log('结束游戏')
          await updateGameStatus(data.gameId, "END")
          notify(data.roomId)
          break
        }
      }
    } catch (e) {
      console.log('有问题:', e.message)
      ctx.websocket.send(JSON.stringify({
        message: "消息不合法:" + message.toString()
      }))
    }
    console.log(message.toString());
  });
}));


function broadcast(data) {
  app.ws.server.clients.forEach(function each(client) {
    client.send(data);
  });
}

console.log('listening to port:3000')
app.listen(3000);