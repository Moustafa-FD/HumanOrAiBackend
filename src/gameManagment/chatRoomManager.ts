import {Server, Socket } from "socket.io";
import { DelayQueue } from "./delayQueue.js";
import { gameData } from "../constants/gameInfo.js";
import { endGameInfo } from "../constants/endGameInfo.js";
import * as aiBot from './aiBot.ts';

interface queueData{
    roomId: string, 
    socketId: string
}
export const aiMatches = new Set<string>();

export async function chatRoomManager(io: Server) {

    const gameTime = 5000


    const startGameQueue = new DelayQueue(2000, (data: queueData) => {
        const isAiMatch = aiMatches.has(data.roomId);
        function aiStartsMatch(): string {
            if (isAiMatch){
                 if (Math.round(Math.random()) > 0.5)
                    return data.socketId
                else{
                    setTimeout(async () => {
                        const aiMsg = await aiBot.chat(data.roomId, "")
                        io.to(data.roomId).emit("msg", aiMsg);
                    }, 2000);
                    return "FakeSocketId"
                } 
            }else{
                return data.socketId
            }
        }
        const gameInfo: gameData = {
            roomId: data.roomId,
            endAt: Date.now() + gameTime,
            startingSocketId: aiStartsMatch(),
            serverTime: Date.now() 
        }
        const clients = io.sockets.adapter.rooms.get(data.roomId);
            let clientsConnected: string[] = [];
            if (clients){
                clientsConnected = [...clients];
            }

        if (isAiMatch){
            console.log(`Ai Game Starting for room ${data.roomId}`);
            const gameResults: endGameInfo = {
                roomId: data.roomId,
                users: [
                    {socketId: clientsConnected[0], isAi: false},
                    {socketId: "wdaadawdawd", isAi: true}
                ]
            }
            endGameQueue.enqueue(gameResults);
        }else{
            console.log(`Player vs Player game has started for room ${data.roomId}`)
            
                
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
        if(aiMatches.has(data.roomId)){
            aiMatches.delete(data.roomId);
            aiBot.chatContext.delete(data.roomId);
        }     

        io.to(data.roomId).emit(`${data.roomId} end game`, data.users)
    } );


    io.on("connection", (socket: Socket) => {

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


        socket.on("msg", async (data) => {
            if (aiMatches.has(data.roomId)){
                setTimeout(() => { io.to(data.roomId).emit("typing")}, (Math.random() * (1400 - 400) + 400))
                const aiMsg = await aiBot.chat(data.roomId, data.msg)
                setTimeout(()=> {io.to(data.roomId).emit("msg", aiMsg)}, (Math.random() * (5000 - 500) + 500))
            }else{
                socket.to(data.roomId).emit("msg", data.msg);
            }
            
        });

        socket.on("typing", roomid=> {
            socket.to(roomid).emit("typing");
        })
        socket.on("stop typing", roomid => {
            socket.to(roomid).emit("stop typing");
        })
    });



  
}