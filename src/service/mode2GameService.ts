import { mode2PlayerQueue, mode2ReadyPlayers, mode2TimedOutPlayers } from '../shared/mode2PlayerQueue.ts';
import { generateTicketId } from '../shared/sharedServiceMethods.ts';

interface GameResponse {
    gameReady: boolean;
    roomId?: string;
    ticketId?: string;
    userNum?: number;
}



const playerQueue = new mode2PlayerQueue(10000, 10000, 5);
const queuesAutoDelete = 10;

export const requestMode2Game = async(userId: string): Promise<GameResponse> => {
    const ticketId = generateTicketId();
    playerQueue.enqueue({userId: userId, ticketId: ticketId});
    return({gameReady: false, ticketId: ticketId});
}

export const checkMode2TicketStatus = async(tickitId: string): Promise<GameResponse | null> => {
    if (mode2TimedOutPlayers.has(tickitId)){
        console.log("The player has been timed out");
        mode2TimedOutPlayers.delete(tickitId);
        return null;
    }
    if (mode2ReadyPlayers.has(tickitId)){
        const readyPlayer = mode2ReadyPlayers.get(tickitId);
        mode2ReadyPlayers.delete(tickitId);
        if (readyPlayer){
            return({
                gameReady: true,
                roomId: readyPlayer.roomId,
                userNum: readyPlayer.userNum
            })
        }
    }
    if (playerQueue.playerInQueueProcess.has(tickitId))
        return({
            gameReady: false,
            ticketId: tickitId
        })

    return null;
}


setInterval(() => {
    mode2TimedOutPlayers.forEach(player => {
        if((Date.now() - player.timeStamp!) / 1000 > queuesAutoDelete)
            mode2TimedOutPlayers.delete(player.ticketId);
    })

    mode2ReadyPlayers.forEach(player => {
        if((Date.now() - player.timeStamp!) / 1000 > queuesAutoDelete)
            mode2ReadyPlayers.delete(player.ticketId);
    })
}, 20000);



setInterval(() => {
    console.log("\n\n\n_________________________________________________________")
    console.log("Timed out Player Queue: ", mode2TimedOutPlayers);
    console.log("New Players Waiting Queue: ", playerQueue.newPlayerQ);
    console.log("Waiting Groups Queue: ", playerQueue.waitingMoreToJoinQ);
    console.log("Ready to play Queue: ", mode2ReadyPlayers);

    console.log("Timed out Player Queue: ", mode2TimedOutPlayers.size);
    console.log("New Players Waiting Queue: ", playerQueue.newPlayerQ.length);
    console.log("Waiting Groups Queue: ", playerQueue.waitingMoreToJoinQ.length);
    console.log("Ready to play Queue: ", mode2ReadyPlayers.size);
}, 2000)