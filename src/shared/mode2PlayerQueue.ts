export const mode2ReadyPlayers = new Map<string, Player>();
export const mode2TimedOutPlayers = new Map<string, Player>();
import { generateRoomId } from "./sharedServiceMethods.ts";


interface Player{
    userId: string,
    ticketId: string,
    timeStamp: number,
    roomId?: string
    userNum?: number
}

interface waitingMoreToJoinPlayers{
    roomId: string,
    humanPlayerGoal: number,
    users: Player[]
}

export class mode2PlayerQueue {
    private newPlayerQ: {dueAt: number; player: Player}[] = [];
    private newPlayerT: NodeJS.Timeout | null = null;

    private waitingMoreToJoinQ: {dueAt: number; group: waitingMoreToJoinPlayers}[] = [];
    private waitingMoreToJoinT: NodeJS.Timeout | null = null;

    constructor(
        private singleUserTimeout: number,
        private groupTimeout: number,
        private humanRoomMax: number
    ){}


    enqueue(newPlayer: Player){


        //if there is a player waiting in new player Q you join them
        if (this.newPlayerQ.length === 1){
            const oldPlayer = this.newPlayerQ.shift(); // Todo/investigate: maybe its better to just be a pop
            const humanPlayerRoomGoal = this.generatePlayerCount();
            const roomId = generateRoomId();

            if (humanPlayerRoomGoal === 0){
                //need to set userNumbers
                mode2ReadyPlayers.set(newPlayer.ticketId, newPlayer)
                oldPlayer && mode2ReadyPlayers.set(oldPlayer.player.ticketId, oldPlayer.player);
            }else{
                const dueAt = Date.now() + this.groupTimeout; 
                if(oldPlayer){
                    const newGroup = {
                        roomId: roomId,
                        humanPlayerGoal: humanPlayerRoomGoal,
                        users: [
                            oldPlayer?.player,
                            newPlayer
                        ]
                    }

                    this.waitingMoreToJoinQ.push({dueAt: dueAt, group: newGroup});
                    this.scheduleWaitingForMorePlayers()
                    return;
                }//Not sure if I need an edge case here or not
            }
        }

        if(this.waitingMoreToJoinQ.length !== 0){
            const headGroup = this.waitingMoreToJoinQ[0];
            headGroup.group.users.push(newPlayer);

            if (headGroup.group.users.length === headGroup.group.humanPlayerGoal){
                this.waitingMoreToJoinT = null;
                //see if you need to shift, and add new timer to the one next in that queue
                this.groupisReady(headGroup.group);
            }
            return;
        }

        //else if there are waiting groups waiting for a player to join them, then you join them
            //if they complete the needed members, clear timeout. and attach it to nexxt group if any
            //if not then make it null

        //then finally, if not both those, then you join the new players queue

        const dueAt = (Date.now() - newPlayer.timeStamp) - this.singleUserTimeout //TODO/Investigate: Is timestamp attibute really needed? Since unless route to here is really slow ok, but if not. Its not needed.
        this.newPlayerQ.push({dueAt: dueAt, player: newPlayer});
        this.scheduleNewPlayers();

    }


    private scheduleNewPlayers(){
        if (this.newPlayerQ.length === 0) return;
        const head = this.newPlayerQ[0];
        const delay = Math.max(0, head.dueAt - Date.now());
        this.newPlayerT = setTimeout(this.newPlayerTimedout, delay);
    }

    private scheduleWaitingForMorePlayers(){
        if (this.waitingMoreToJoinQ.length === 0) return;
        const head = this.waitingMoreToJoinQ[0];
        const delay = Math.max(0, head.dueAt - Date.now());
        this.waitingMoreToJoinT = setTimeout(this.groupTimedout, delay);
    }
    

    private newPlayerTimedout(){
        this.newPlayerT = null;
        const timeOutPlayer = this.newPlayerQ.shift();
        if (timeOutPlayer)
            mode2TimedOutPlayers.set(timeOutPlayer.player.ticketId, timeOutPlayer.player);
    }

    private groupTimedout(){
        this.waitingMoreToJoinT = null;
        const group = this.waitingMoreToJoinQ.shift()?.group;
        if (this.waitingMoreToJoinQ.length !== 0){
            //do the new sequence, of adding their timeout just in case
        }
        group && this.groupisReady(group)

    }

    private groupisReady(group: waitingMoreToJoinPlayers){
        const userNumbers = [1,2,3,4,5];

        //shuffling method, this is needed to give players their user names in game, but it has to be in random from 1 - 5, to make it harder for users to tell who is Ai and not;
        for (let i = userNumbers.length - 1; i> 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [userNumbers[i], userNumbers[j]] = [userNumbers[j], userNumbers[i]];
        }

        group.users.map(player => {
            player.roomId = group.roomId;
            player.userNum = userNumbers.pop();
            mode2ReadyPlayers.set(player.ticketId, player);
        })
        //Start to let AI to setup match and take up rest of userNumbers
    }

    private generatePlayerCount(){
        return Math.floor(Math.random() * this.humanRoomMax) + 1;
    }

    

}