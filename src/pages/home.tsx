import { Button, Input, Space, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { history } from "umi";
// import {createWebSocket,closeWebSocket} from './websocket';
import axios from "@/request";

export default function HomePage() {
  const [roomID, setRoomID] = useState("")
  const ws = useRef<WebSocket | null>(null);
  
  useEffect(()=>{
    ws.current = new WebSocket(`ws://192.168.195.187:3000/api/connect/${localStorage.getItem("player")}`);
    ws.current.addEventListener("open", (event) => {
      // ws.current.send("Hello Server!");
      console.log('hello world')
    });
    ws.current.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      try {
        const res = JSON.parse(event.data)
        if(res.type) {
          switch (res.type) {
            case 'JOIN_ROOM_RET':
            case 'CREATE_ROOM_RET': {
              history.push(`/room/${res.data}`)
              break;
            }
          }
        }
      } catch (error) {
        
      }
    });
    return ()=>ws.current?.close()
  }, [])

  const onJoinRoom = async () => {
    if (!roomID) {
      return message.error("你妈了逼的，没有ID怎么加房间啊？你猪脑啊？")
    }
    ws.current?.send(JSON.stringify({
        operation: "JOIN_ROOM",
        id: localStorage.getItem("player"),
        roomId: roomID,
    }))
    // const { data } = await axios.put(`/api/room/${roomID}`)
    // if (data.success) {
    //   message.success("操作成功咯，开冲！")
    //   history.push(`/room/${roomID}`)
    // }
  }

  const onCreateRoom = async()=>{
    ws.current?.send(JSON.stringify({
      operation: "CREATE_ROOM",
      id: localStorage.getItem("player"),
  }))
    // const { data } = await axios.post("/api/room/create")
    // if (data.success) {
    //   message.success("操作成功咯，开冲！")
    //   history.push(`/room/${data}`)
    // }
  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center bg-gray'>
      <h2 className="mb-10">Please pick one below to continue</h2>
      <div>
        <div onClick={onCreateRoom} className="w-[500px] text-lg h-[200px] flex items-center justify-center rounded-lg shadow-lg mb-8 bg-white cursor-pointer hover:shadow-md transition-all">
          Create a new room
        </div>
        <div className="w-[500px] text-lg h-[200px] flex items-center justify-center rounded-lg shadow-lg bg-white">
          <Space direction="vertical" align="center" size={20}>
            <Input value={roomID} onChange={e => setRoomID(e.target.value)} className="w-[300px]" placeholder="Room ID" />
            <Button type="primary" onClick={onJoinRoom}>
              Join a room
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
