const uuid = require("uuid")
const util = require("../util")


class Room {
  playerList = []
  gameList = []
  redList = []
  blueList = []
  max = 10
  id = ""
  constructor() {
    this.id = `room__${uuid.v4()}`
  }
  notify() {
    console.log('notify的时候，playerList是', this.playerList.map(item=>item.name))
    this.playerList.forEach(player => {
      const gameOrigin = this.getActiveGame()
      console.log("gameOrigin", gameOrigin?.id, gameOrigin?.status)
      let data = {
        id: this.id,
        game: gameOrigin ? {
          id: gameOrigin.id,
          status: gameOrigin.status,
          heroList: player.team === "RED" ? gameOrigin.redList : gameOrigin.blueList
        } : null,
        playerList: this.playerList.map(item=>({
          name: item.name, 
          team: item.team,
          dice: item.dice,
          isReady: item.isReady
        })),
      }
      console.log('notify data-->', data)
      player.socket.send(JSON.stringify({ type: "ROOM_INFO", data }))
    })
  }
  addGame(game) {
    this.gameList.push(game)
  }
  addPlayer(player) {
    this.playerList.push(player)
    console.log('房间addPlayer:=->', player.name, this.playerList.map(item=>item.name))
  }
  removePlayer(name) {
    const idx = this.playerList.findIndex(item => item.name == name)
    this.playerList.splice(idx, 1)
  }
  addRed(player) {
    if (!this.redList.find(item => item.name === player.name)) {
      this.redList.push(player)
    }
    const idx = this.blueList.findIndex(item => item.name !== player.name)
    this.blueList.splice(idx, 1)
  }
  addBlue(player) {
    if (!this.blueList.find(item => item.name === player.name)) {
      this.blueList.push(player)
    }
    const idx = this.redList.findIndex(item => item.name !== player.name)
    this.redList.splice(idx, 1)
  }
  getTeamListByPlayerId(name) {
    console.log(this.playerList)
    if (!this.getActiveGame()) {
      console.log('游戏还没开始，返回所有玩家', this.playerList)
      return this.playerList
    }
    const target = this.playerList.find(item => item.name === name)
    if (!target) {
      console.log('没找到这个玩家')
      return []
    }
    if (target.team === "RED") {
      console.log('返回红方玩家', this.redList)
      return this.redList
    }
    console.log('返回蓝色玩家', this.blueList)
    return this.blueList
  }
  getActiveGame() {
    // 优先init
    for (let i = this.gameList.length - 1; i >= 0; i--) {
      if (["INIT", "PLAYING"].includes(this.gameList[i].status)) {
        console.log('getActiveGame选中的是第', i, '个')
        return this.gameList[i]
      }
    }
    return null
  }
}

module.exports = Room
