const Room = require("./Room")
const Game = require("./Game")

class Player {
  name = ""
  // 只能存在于一个房间
  room = ""
  game = ""
  pool = null 
  dice = 0
  isReady = false
  socket = null
  team = "" 
  constructor(name, pool) {
    this.name = name
    this.pool = pool
  }
  setSocket(socket){
    this.socket = socket
  }
  // 加入房间
  joinRoom(roomId) {
    const target = this.pool.getRoom(roomId)
    if (!target) {
      console.log('没有这个room，自动创建。。。')
      this.createRoom()
      return
    }
    // 进房发两个骰子
    this.dice = 2
    target.addPlayer(this)
    this.room = target.id
    target.notify()
  }
  // 创建房间
  createRoom() {
    const room = new Room()
    // 进房发两个骰子
    this.dice = 2
    room.addPlayer(this)
    this.room = room.id
    this.pool.addRoom(room)
    room.notify()
    return room
  }
  // 退出房间
  exitRoom(roomId){
    const target = this.pool.getRoom(roomId)
    if (!target) {
      return
    }
    target.removePlayer(this.name)
    target.notify()
    this.team = ""
  }
  joinRed(){
    this.team = "RED"
    const target = this.pool.getRoom(this.room)
    if (!target) {
      return
    }
    target.notify()
  }
  joinBlue(){
    this.team = "BLUE"
    const target = this.pool.getRoom(this.room)
    if (!target) {
      return
    }
    target.notify()
  }
  // 摇一次
  roll() {
    if (!this.game) {
      return
    }
    const target = this.pool.getGame(this.game)
    if (!target) {
      return
    }
    this.dice -= 1
    target.createAnRandomHero(this.team)
  }

  createGame(){
    const game = new Game()
    const target = this.pool.getRoom(this.room)
    if (!target) {
      return
    }
    game.room  = target
    this.pool.addGame(game)
    target.addGame(game)
    target.notify()
  }
  // 开玩 ，一把发一个骰子
  startGame() {
    if (!this.game) {
      return
    }
    const target = this.pool.getRoom(this.game)
    if (!target) {
      return
    }
    target.startGame()
    this.dice += 1
  }
}

module.exports = Player
