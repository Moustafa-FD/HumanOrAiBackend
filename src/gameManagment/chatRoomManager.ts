import {Server, Socket } from "socket.io";
import { DelayQueue } from "./delayQueue.js";
import { gameData } from "../constants/gameInfo.js";

interface queueData{
    roomId: string, 
    socketId: string
}

export async function chatRoomManager(io: Server, httpServer: any) {

    const gameTime = 2 * 60000

    const startGameQueue = new DelayQueue(1500, (data: queueData) => {
        const gameInfo: gameData = {
            roomId: data.roomId,
            endAt: Date.now() + gameTime,
            startingSocketId: data.socketId,
            serverTime: Date.now() 
        }
        io.to(data.roomId).emit(`${data.roomId} start game`, gameInfo)
    })


    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);


        socket.on("join room",  (data, ack) => {
            if (!data.roomId || !data.userId) {
                console.log("Invalid roomId or userId");
                return ack({ status: "Error", message: "Invalid roomId or userId" });
            }
            socket.join(data.roomId);
            if (io.sockets.adapter.rooms.get(data.roomId)?.size === 2){
                startGameQueue.enqueue({roomId: data.roomId, socketId: socket.id})
            }
            return ack({ status: "Ok", message: `Joined room ${data.roomId}` });
        });


        socket.on("msg", (data) => {
            socket.to(data.roomId).emit("msg", data.msg);
        })
    });



  
}