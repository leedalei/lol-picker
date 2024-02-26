import { useEffect, useRef, useState } from "react";
import PickingPage from '../components/PickingPage'
import BeforePicking from "@/components/BeforePicking";
import { useParams } from 'umi';
import axios from "@/request";

const Room = () => {
  const [roomInfo, setRoomInfo] = useState<{ game: any, userList: [] } | null>(null)
  const params = useParams()
  const id = params.id
  const ws = useRef<WebSocket | null>(null);

  // useEffect(()=>{
  //   const getRoomInfo = async ()=>{
  //     const { data} = await axios.get(`/api/room?id=${id}`)
  //     const r = JSON.parse(data)
  //     if (r.success) {
  //       console.log(r.data)
  //       setRoomInfo(r.data)
  //     }
  //   }
  //   getRoomInfo()
  // }, [])

  // useEffect(()=>{
  //   ws.current = new WebSocket(`ws://192.168.195.187:3000/api/connect/${localStorage.getItem("player")}`);
  //   ws.current.addEventListener("message", (event) => {
  //     console.log("Message from server ", JSON.parse(event.data));
  //     try {
  //       const res = JSON.parse(event.data)
  //       if(res.type) {
  //         switch (res.type) {
  //           case 'JOIN_ROOM_RET':
  //           case 'CREATE_ROOM_RET': {
  //             break;
  //           }
  //           case 'ROOM_INFO' :{
  //             setRoomInfo(res.data)
  //           }
  //         }
  //       }
  //     } catch (error) {
        
  //     }
  //   });
  //   return ()=>ws.current?.close()
  // }, [])

  return (
    <div >
       <PickingPage roomInfo={roomInfo} ws={ws}/>
      {/* {
        !roomInfo?.game ? <BeforePicking roomInfo={roomInfo} ws={ws}/> : <PickingPage roomInfo={roomInfo} ws={ws}/>
      } */}
    </div>
  );
};

export default Room;
