import {Server, Socket } from "socket.io";

export async function chatRoomManager(io: Server, httpServer: any) {


    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);


        socket.on("join room",  (data, ack) => {
            if (!data.roomId || !data.userId) {
                console.log(data);
                console.log("Invalid roomId or userId");
                return ack({ status: "Error", message: "Invalid roomId or userId" });
            }
            console.log(data);
            socket.join(data.roomId);
            socket.to(data.roomId).emit(`Opnent joined`, { userId: data.userId });
            return ack({ status: "Ok", message: `Joined room ${data.roomId}` });
        });
    });



  
}