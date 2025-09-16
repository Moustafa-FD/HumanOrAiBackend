import { generateTicketId, generateRoomId } from '../shared/sharedServiceMethods.ts';





export const requestMode2Game = async(userId: string) => {
    const ticketId = generateTicketId();
    return(ticketId);
}


export const checkMode2TicketStatus = async(tockitId: string) => {
    
}