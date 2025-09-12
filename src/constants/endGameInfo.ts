export interface gameUsers {
    socketId: string,
    isAi: boolean
}

export interface endGameInfo{
    roomId: string,
    users: gameUsers[]
}