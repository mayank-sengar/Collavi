import { WebSocketServer} from 'ws';

export default function WebRTCServer(server){
//webrtc signalling server running on 
// const wss = new WebSocketServer({port :8080});
//handling webrtc server in websocket server itself
const wss = new WebSocketServer(server);
    console.log("WS Server running on port 8080")
//callId : [ws1,ws2] set of sockets (2);
const rooms = new Map();

wss.on("connection",(ws)=>{
    ws.on("message",(data)=>{
        let message;
        try {
            message = JSON.parse(data.toString());
        } catch (err) {
            ws.send(JSON.stringify({ type: "error", reason: "invalid-json" }));
            return;
        }

        const {type ,callId } = message;
        if(!callId || !type) return;

        //create room if room is not in 'rooms' map
        if(!rooms.has(callId)){
            rooms.set(callId , []);
        }

        const room = rooms.get(callId);

        //join room
        if(type === "join"){
          if(room.length >= 2) {
            ws.send(JSON.stringify({type: "room-full"}));
            console.log("room full")
            return;
            }
          if (room.includes(ws)) return; // already joined
            room.push(ws);
            ws.callId= callId;
            // console.log(ws);


           ws.send(JSON.stringify({
                type: "role",
                role: room.length==1 ? "caller" : "receiver",
            
            }))
          console.log("User joined")

                // notify both peers when the room is ready for signalling
                if (room.length === 2) {
                    room.forEach((peer) => {
                        if (peer.readyState === 1) {
                            peer.send(JSON.stringify({ type: "ready" }));
                        }
                    })
                }

        return;

        }

        // ignore signalling until both peers joined
        if (type !== "join" && room.length < 2) {
             return;
        }

        

        //directly forward signalling message to other peer
        room.forEach((peer)=>{
            if(peer!== ws && peer.readyState ==1){
                peer.send(JSON.stringify(message));
                console.log("signaling message",message);
            }
        })
    })

     ws.on("close", ()=>{
            const callId = ws.callId;
            
            if(!callId) return;

            const room = rooms.get(callId);
            if(!room) return;

            //removing the room which is disconnected
           const updatedRoom = room.filter(peer => peer !== ws);
           rooms.set(callId, updatedRoom);

           // notify remaining peers
           updatedRoom.forEach(peer => {
             if (peer.readyState === 1) {
               peer.send(JSON.stringify({ type: "peer-left" }));
             }
           });

           if (updatedRoom.length === 0) {
              rooms.delete(callId);
          }

            //if both the user are disconnected remove the room
            // if(room.callId.length == 0){
            //     rooms.delete(callId);
            // }

        })
})

}