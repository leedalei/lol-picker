const uuid = require("uuid")
const heroList = require("../config")

class Game {
  status = "INIT"
  // 属于某个房间
  room = null
  pickList = []
  redList = []
  blueList = []
  id = ""
  constructor(room) {
    this.id = `game__${uuid.v4()}`
    this.room = room
    // 随机十个
    this.init()
  }
  setRoom(room){
    this.room = room
  }
  init() {
    const max = 30
    const all = this.getRandomElements(heroList, max)
    this.redList.push(...all.slice(0, max / 2))
    this.blueList.push(...all.slice(max / 2))
    this.pickList = [...this.redList, ...this.blueList]
  }
  getRandomElements(arr, n) {
    let result = new Array(n);
    let len = arr.length;
    let taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandomElements: more elements taken than available");
    while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
  startGame() {
    this.status = "PLAYING"
    if (!this.room) {
      return
    }
    console.log('开始游戏咯：', this.status, this.id)
    this.room.notify()
  }
  endGame() {
    this.status = "END"
    if (!this.room) {
      return
    }
    console.log('结束游戏咯', this.status, this.id)
    this.room.notify()
  }
}

module.exports = Game
