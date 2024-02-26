import { useParams } from 'umi';
import { Button, Space, Tag, Tooltip, message } from 'antd'
import React, { useEffect, useMemo, useRef } from 'react'

const BeforePicking = ({
  roomInfo,
  ws
}: any) => {
  const params = useParams()

  console.log('roomInfo---------', roomInfo)

  const sendMsg = (operation: string)=>{
    // if(!isRoomOwner && operation==="CREATE_GAME") {
    //   return message.error("你够吧不是房主，点鸡毛啊？")
    // }
    ws?.current?.send(JSON.stringify({
        operation,
        id: localStorage.getItem("player"),
        roomId: params.id
    }))
  }

  const isRoomOwner = useMemo(()=>{
    if (localStorage.getItem("player") === roomInfo?.userList?.[0]?.id){
      return true
    }
    return false
  }, [roomInfo])

  const onCopy = ()=>{
    navigator.clipboard.writeText(params.id|| "").then(()=>{
      message.success("复制成功")
    }).catch(()=>{
      message.error("复制失败")
    })
  }
  
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center bg-gray'>
      <div className='text-lg text-n60 cursor-pointer mb-4' >房间号(点击不可复制)：{params.id}</div>
      <div className="text-2xl font-bold mb-8">选个颜shai！</div>
      <Space size={20}>
        <div onClick={()=>sendMsg("JOIN_RED")}>
          <span className="text-xs text-red-500">就选这个钩把红色</span>
          <div className="w-[400px] h-[200px] rounded-lg shadow-md bg-white hover:bg-red-100 cursor-pointer hover:shadow-sm transition-all border-red-500 border border-solid">
            {roomInfo?.userList?.filter((item: any)=>item?.team==="RED").map((item: any) => <Tag key={item.id}  color={item.id === localStorage.getItem("player") ? "gold": "error"}  className="m-4">{item.name}</Tag>)}
          </div>
        </div>
        <div onClick={()=>sendMsg("JOIN_BLUE")}>
          <span className="text-xs text-blue-500">就选这个B蓝色</span>
          <div className="w-[400px] h-[200px] rounded-lg shadow-md  bg-white hover:bg-blue-100 cursor-pointer hover:shadow-sm transition-all border-blue-500 border border-solid">
            {roomInfo?.userList?.filter((item: any)=>item?.team==="BLUE").map((item: any) => <Tag key={item.id} color={item.id === localStorage.getItem("player") ? "gold": "blue"}  className="m-4">{item.name}</Tag>)}
          </div>
        </div>
      </Space>
      <Tooltip overlay="等人齐了，就点这个">
        <Button type="primary" size="large" className="mt-8" onClick={()=>sendMsg("CREATE_GAME")}>
          游戏开始
        </Button>
      </Tooltip>
      <div className="text-xs text-slate-300 mt-2">你{isRoomOwner ? '是':'不是'}房主</div>
    </div>
  )
}

export default BeforePicking