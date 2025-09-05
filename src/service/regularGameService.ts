import { time } from 'console';
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



const playerQueue = new Queue<Player>();
const gameReadyPlayer = new Map<string, string>();

let timeout = 20;

 const generateTicketId = () => {
    return Math.random().toString(36).substring(2, 10);
}


const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
}



const createGameRoom = async ( roomId: string) => {

}


export const requestGame = async(userId) : Promise<GameResponse> => {

    if (playerQueue.size === 0){
        const ticketId = generateTicketId();
        playerQueue.enqueue({ userId: userId, ticketId: ticketId, timestamp: Date.now()});
        return { gameReady: false, ticketId: ticketId };
    }

    const roomId = generateRoomId();
    const player2 = playerQueue.dequeue();
    if (player2) {
        gameReadyPlayer.set(player2.ticketId, roomId);
    }

    await createGameRoom(roomId);
    return { gameReady: true, roomId: roomId };    
}



export const checkTicketStatus = async(ticketId: string) : Promise<GameResponse> => {
    if (gameReadyPlayer.has(ticketId)){
        const roomId = gameReadyPlayer.get(ticketId);
        gameReadyPlayer.delete(ticketId);
        return { gameReady: true, roomId: roomId };
    }

    const player = playerQueue.peek();

    if (player?.ticketId === ticketId) {
        const timeElapsed = (Date.now() - player.timestamp) / 1000;
        if (timeElapsed > timeout){
            playerQueue.dequeue();
            
            const roomId = generateRoomId();
            await createGameRoom(roomId);
            //create bot and put in roomID

            return {gameReady: true, roomId: roomId}
        }
    }

    return {gameReady: false, ticketId: ticketId}
}


