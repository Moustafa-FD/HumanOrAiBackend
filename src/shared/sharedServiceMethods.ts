export const generateTicketId = () => {
    return Math.random().toString(36).substring(2, 10);
}


export const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
}
