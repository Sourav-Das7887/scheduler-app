import { Request, Response } from "express";
import * as slotsService from "../services/slotServices";
import { SlotInput } from "../types/solt";


export const createSlot = async (req: Request, res: Response) => {
    try {
        const slotData: SlotInput = req.body;
        const newSlot = await slotsService.createSlot(slotData);
        res.status(201).json(newSlot);
    }catch (error: any) {
        console.error("Error creating slot:", error);
        res.status(400).json({ error: error.message });
    }
}

export const getSlotsForWeek = async (req: Request, res: Response) => {
    try {
        const start = req.query.start as string | undefined;
        const weekSlots = await slotsService.getSlotsForWeek(start);
        res.json({ slots: weekSlots });
    }
    catch (error: any) {
        console.error("Error fetching slots for week:", error);
        res.status(500).json({ error: error.message });//server error
    }
}

export const updateSlot = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updates: Partial<SlotInput> = req.body;
    const date = req.body.date; // <-- read date from body

    const updatedSlot = await slotsService.updateSlot(id, updates, date);
    res.json(updatedSlot);
  } catch (error: any) {
    console.error("Error updating slot:", error);
    res.status(500).json({ error: error.message });
  }
};


export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const date = req.query.date as string | undefined; // <-- read date from query

    const result = await slotsService.deleteSlot(id, date);
    res.json(result);
  } catch (error: any) {
    console.error("Error deleting slot:", error);
    res.status(500).json({ error: error.message });
  }
};


