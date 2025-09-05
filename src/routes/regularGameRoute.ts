import type { Request, Response } from "express";
import { checkTicketStatus, requestGame } from "../service/regularGameService.js";

export const getTicket = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await requestGame(userId);
    
    res.status(200).json({ response });
}

export const ticketStatus = async (req: Request, res: Response) => {
    const {ticketId} =  req.params;
    const response = await checkTicketStatus(ticketId)

    return res.status(200).json({response});
}
