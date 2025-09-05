import {requestGame } from './../service/regularGameService.ts';

export const getTicket = async (req, res) => {
    const { userId } = req.body;
    const response = await requestGame(userId);
    
    res.status(200).json({ response });
}

export const ticketStatus = async (req, res) => {
    
}