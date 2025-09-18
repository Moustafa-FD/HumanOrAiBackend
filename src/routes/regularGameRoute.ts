import type { Request, Response } from "express";
import { checkTicketStatus, requestGame } from "../service/regularGameService.js";
import { checkMode2TicketStatus, requestMode2Game } from "../service/mode2GameService.ts";

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


export const getMode2Ticket = async(req: Request, res: Response) => {
    const { userId } = req.params;
    const response = await requestMode2Game(userId);

    if (response)
        return res.status(200).json({response})
    else
        return res.status(500).json({error: "Internal error has occured"});

}

export const getMode2TicketStatus = async(req: Request, res: Response) => {
    const {ticketId} =  req.params;
    const response = await checkMode2TicketStatus(ticketId);
    if (response)
        return res.status(200).json({response});    
    else
        return res.status(404).json({response: "User has timed out"});
}