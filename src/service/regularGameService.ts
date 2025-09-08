import Queue from 'yocto-queue'

export interface GameResponse {
    gameReady: boolean;
    roomId?: string;
    ticketId?: string;
}

interface Player {
    userId: string;
    ticketId: string;
    timestamp: number;
}

interface GameReadyPlayerInfo{
    roomId: string,
    lastHearbeat: number
}



const playerQueue = new Queue<Player>();
const gameReadyPlayers = new Map<string, GameReadyPlayerInfo>();

let botSelectionTimeout = 20;
let inActivityTimeout = 40

 const generateTicketId = () => {
    return Math.random().toString(36).substring(2, 10);
}


const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
}




export const requestGame = async(userId: string) : Promise<GameResponse | null> => {

    console.log("requestGame called");
    if (playerQueue.size === 0){
        console.log("Player added to queue");
        const ticketId = generateTicketId();
        playerQueue.enqueue({ userId: userId, ticketId: ticketId, timestamp: Date.now()});
        return { gameReady: false, ticketId: ticketId };
    }

    //check if same user tries to queue again
    const topQueuePlayerId = playerQueue.peek()?.userId
    if (topQueuePlayerId !== userId){
        return null;
    } 

    const roomId = generateRoomId();
    const player2 = playerQueue.dequeue();
    if (player2) {
        gameReadyPlayers.set(player2.ticketId, {roomId: roomId, lastHearbeat:Date.now()});
    }
    return { gameReady: true, roomId: roomId };    
}



export const checkTicketStatus = async(ticketId: string) : Promise<GameResponse | null> => {
    if (gameReadyPlayers.has(ticketId)){
        const roomId = gameReadyPlayers.get(ticketId)?.roomId;
        gameReadyPlayers.delete(ticketId);
        return { gameReady: true, roomId: roomId };
    }

    const player = playerQueue.peek();

    if (player?.ticketId === ticketId) {
        const timeElapsed = (Date.now() - player.timestamp) / 1000;

        if (timeElapsed > botSelectionTimeout){
            playerQueue.dequeue();
            
            const roomId = generateRoomId();
            //await createGameRoom(roomId);
            //create bot and put in roomID

            return {gameReady: true, roomId: roomId}
        }
    }

    return {gameReady: false, ticketId: ticketId}
}





setInterval(async () => {
    console.log(`Players waiting to join Game: ${playerQueue.size}` )
    console.log(`Players that are ready to play: ${gameReadyPlayers.size}`)
}, 5000)

setInterval(() => {
    let player = playerQueue.peek();
    if (player?.timestamp){
        if ((Date.now() - player?.timestamp) / 1000 > inActivityTimeout)
            playerQueue.dequeue();
    }
    
}, 2000)

setInterval(() => {
    gameReadyPlayers.forEach((playerInfo, ticketId, )=> {
        if ((Date.now() - playerInfo.lastHearbeat) / 1000 > inActivityTimeout)
            gameReadyPlayers.delete(ticketId)
    })    
}, 2000)