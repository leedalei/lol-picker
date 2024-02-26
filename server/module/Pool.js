class Pool {
  name = ""
  roomList = []
  playerList = []
  gameList=[]
  constructor() {
    this.name = "pool"
  }
  addRoom(room) {
    this.roomList.push(room)
  }
  addPlayer(player) {
    this.playerList.push(player)
    console.log('现在playerList池子里是:=>', this.playerList.map(item=>item.name))
  }
  addGame(game) {
    this.gameList.push(game)
  }
  getPlayer(name){
    return this.playerList.find(item=>item.name = name)
  }
  getRoom(id){
    return this.roomList.find(item=>item.id = id)
  }
  getGame(id) {
    return this.gameList.find(item=>item.id = id)
  }
}

module.exports = Pool