import React, { useMemo, useState } from 'react'
import { Button, Popconfirm, Space, message, } from 'antd'
import { history, useParams } from 'umi';
import {getRandom } from './imgRandomPick'
import hero from './hero'

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElements(arr: any[], n: number) {
  let result = new Array(n);
  let len = arr.length;
  let taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandomElements: more elements taken than available");
  while (n--) {
    let x = Math.floor(Math.random() * len);
    console.log(x)
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const Picking = ({
  roomInfo, ws
}: any) => {
  const params = useParams()
  const [initPick, setInitPick] = useState(getRandomElements(hero, 40))

  // const onConfirm = (operation: string) => {
  //   if(!isRoomOwner) {
  //     return message.error("不是房主你点鸡毛啊？")
  //   }
  //   ws?.current?.send(JSON.stringify({
  //     operation,
  //     id: localStorage.getItem("player"),
  //     roomId: params.id,
  //     gameId: roomInfo?.game?.id
  //   }))
  // }

  // const onExit = ()=>{
  //   onConfirm("EXIT_ROOM")
  //   history.push("/home")
  // }

  // const onReroll = () => {
  //   setInitPick(getRandomElements(hero, 20))
  // }

  // const isRoomOwner = useMemo(()=>{
  //   if (localStorage.getItem("player") === roomInfo?.userList?.[0]?.id){
  //     return true
  //   }
  //   return false
  // }, [roomInfo])

  // const selfInfo = useMemo(()=>{
  //   const target = roomInfo?.userList.find((item: any)=>item.id === localStorage.getItem("player"))
  //   return target
  // }, [roomInfo])

  // const broList = useMemo(()=>{
  //   return roomInfo?.userList?.filter((item: any)=>item.team === selfInfo.team && item.id !== localStorage.getItem("player"))
  // }, [selfInfo])

  return (
    <div className='h-screen flex flex-col'>
      <div className='p-4 pb-0 border-0 border-b border-dashed flex flex-wrap'>
        {initPick?.map((item: any) => <div key={item.name} style={{ backgroundImage: `url('${item.avatar}')` }} className='bg-contain text-red-700 text-shadow font-bold bg-center w-[100px] h-[100px] flex  items-center justify-center border border-dashed cursor-pointer mr-4 mb-4'>
          {item.name}
        </div>)}
      </div>
      
    
    </div>
  )
}

export default Picking