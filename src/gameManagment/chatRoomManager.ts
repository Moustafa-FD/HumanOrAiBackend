import {Server, Socket } from "socket.io";
import { DelayQueue } from "./delayQueue.js";
import { gameData } from "../constants/gameInfo.js";
import { endGameInfo } from "../constants/endGameInfo.js";

interface queueData{
    roomId: string, 
    socketId: string
}
export const aiMatches = new Set<string>();

export async function chatRoomManager(io: Server, httpServer: any) {

    const gameTime = 2 * 60000


    const startGameQueue = new DelayQueue(2000, (data: queueData) => {
        const gameInfo: gameData = {
            roomId: data.roomId,
            endAt: Date.now() + gameTime,
            startingSocketId: data.socketId,
            serverTime: Date.now() 
        }
        if (aiMatches.has(data.roomId)){
            console.log(`Ai Game Starting for room ${data.roomId}`);
            //Ai Start game logic here
        }else{
            console.log(`Player vs Player game has started for room ${data.roomId}`)
            const clients = io.sockets.adapter.rooms.get(data.roomId);
            let clientsConnected: string[] = [];
            if (clients){
                clientsConnected = [...clients];
            }
                
            const gameResults: endGameInfo = {
            roomId: data.roomId,
            users: [
                {socketId: clientsConnected[0], isAi: false},
                {socketId: clientsConnected[1], isAi: false}
            ]};
            endGameQueue.enqueue(gameResults);
        }
        io.to(data.roomId).emit(`${data.roomId} start game`, gameInfo)
    });

    const endGameQueue = new DelayQueue(gameTime, (data: endGameInfo) => {
        aiMatches.delete(data.roomId);
        io.to(data.roomId).emit(`${data.roomId} end game`, data.users)
    } );


    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);


        socket.on("join room",  (data, ack) => {
            if (!data.roomId || !data.userId) {
                console.log("Invalid roomId or userId");
                return ack({ status: "Error", message: "Invalid roomId or userId" });
            }
            socket.join(data.roomId);
            if (io.sockets.adapter.rooms.get(data.roomId)?.size === 1){
                startGameQueue.enqueue({roomId: data.roomId, socketId: socket.id})
            }
            return ack({ status: "Ok", message: `Joined room ${data.roomId}` });
        });


        socket.on("msg", (data) => {
            socket.to(data.roomId).emit("msg", data.msg);
        })
    });



  
}