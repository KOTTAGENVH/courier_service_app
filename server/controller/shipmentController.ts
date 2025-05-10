// controllers/shipmentController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateShipmentDto,
  UpdateShipmentStatusDto,
  DelayShipmentDto,
  CancelShipmentDto,
  ShipmentStatus,
} from '../dto/shipDto.js';

const prisma = new PrismaClient();

async function validateDto<T>(DtoClass: new () => T, payload: unknown, res: Response): Promise<T | null> {
  const dtoObject = plainToInstance(DtoClass, payload);
  const errors = await validate(dtoObject as object);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return null;
  }
  return dtoObject;
}

// Add a new shipment (user)
export const addShipment = async (req: Request, res: Response) => {
  const dto = await validateDto(CreateShipmentDto, req.body, res);
  if (!dto) return;

  try {
    const shipment = await prisma.shipment.create({
      data: {
        senderAddress: dto.senderAddress,
        receiverFirstName: dto.receiverFirstName,
        receiverLastName: dto.receiverLastName,
        receiverAddress: dto.receiverAddress,
        receiverTelephone: dto.receiverTelephone,
        userId: dto.userId,
      },
    });

    await prisma.notification.create({
      data: {
        title: 'Shipment Created',
        description: `Shipment #${shipment.id} has been created.`,
        userId: dto.userId,
        shipmentId: shipment.id,
      },
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shipment', details: error });
  }
};

// Get all shipments (admin)
export const getAllShipmentsAdmin = async (_req: Request, res: Response) => {
  try {
    const shipments = await prisma.shipment.findMany({ include: { notifications: true, user: true } });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipments', details: error });
  }
};

// Get all shipments for a user
export const getAllShipmentsUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const shipments = await prisma.shipment.findMany({ where: { userId }, include: { notifications: true } });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user shipments', details: error });
  }
};

// Get shipment by ID (admin)
export const getShipmentByIdAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const shipment = await prisma.shipment.findUnique({ where: { id }, include: { notifications: true, user: true } });
    if (!shipment)  res.status(404).json({ error: 'Shipment not found' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipment', details: error });
  }
};

// Get shipment by ID for a user
export const getShipmentByIdUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = Number(req.params.userId);
  try {
    const shipment = await prisma.shipment.findFirst({ where: { id, userId }, include: { notifications: true } });
    if (!shipment)  res.status(404).json({ error: 'Shipment not found for this user' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipment', details: error });
  }
};

// Update shipment status (admin)
export const updateShipmentStatus = async (req: Request, res: Response) => {
  const dto = await validateDto(UpdateShipmentStatusDto, req.body, res);
  if (!dto) return;

  const id = Number(req.params.id);
  try {
    const dateFieldMap: Record<ShipmentStatus, string> = {
      PENDING: 'none',
      ON_ROUTE_TO_COLLECT: 'collectedDate',
      COLLECTED: 'collectedDate',
      SHIPPED: 'shippedDate',
      COMPLETED: 'completedDate',
      CANCELED: 'canceledDate',
    };

    const updateData: Record<string, unknown> = { status: dto.status };
    const dateKey = dateFieldMap[dto.status];
    if (dateKey !== 'none') updateData[dateKey] = new Date();

    const updated = await prisma.shipment.update({ where: { id }, data: updateData });

    await prisma.notification.create({
      data: {
        title: 'Status Updated',
        description: `Shipment #${updated.id} status changed to ${updated.status}.`,
        userId: updated.userId,
        shipmentId: updated.id,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status', details: error });
  }
};

// Cancel shipment (user) during pending
export const cancelShipmentUser = async (req: Request, res: Response) => {
  const dto = await validateDto(CancelShipmentDto, req.body, res);
  if (!dto) return;

  const id = Number(req.params.id);
  const userId = Number(req.params.userId);
  try {
    const shipment = await prisma.shipment.findFirst({ where: { id, userId, status: ShipmentStatus.PENDING } });
    if (!shipment)  res.status(400).json({ error: 'Shipment cannot be cancelled' });

    const cancelled = await prisma.shipment.update({ where: { id }, data: { status: ShipmentStatus.CANCELED, canceledDate: new Date() } });

    await prisma.notification.create({
      data: {
        title: 'Shipment Cancelled',
        description: `You have cancelled shipment #${cancelled.id}.`,
        userId,
        shipmentId: cancelled.id,
      },
    });

    res.json(cancelled);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel shipment', details: error });
  }
};

// Flag delay (user)
export const flagShipmentDelay = async (req: Request, res: Response) => {
  const dto = await validateDto(DelayShipmentDto, req.body, res);
  if (!dto) return;

  const id = Number(req.params.id);
  const userId = Number(req.params.userId);
  try {
    const updated = await prisma.shipment.updateMany({ where: { id, userId }, data: { delayFlag: dto.delayFlag } });
    if (updated.count === 0)  res.status(404).json({ error: 'Shipment not found or not yours' });

    await prisma.notification.create({
      data: {
        title: 'Delay Flagged',
        description: `Shipment #${id} delay flag set to ${dto.delayFlag}.`,
        userId,
        shipmentId: id,
      },
    });

    res.json({ id, delayFlag: dto.delayFlag });
  } catch (error) {
    res.status(500).json({ error: 'Failed to flag delay', details: error });
  }
};

// Cancel shipment (admin)
export const cancelShipmentAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const cancelled = await prisma.shipment.update({ where: { id }, data: { status: ShipmentStatus.CANCELED, canceledDate: new Date() } });

    await prisma.notification.create({
      data: {
        title: 'Shipment Cancelled by Admin',
        description: `Admin cancelled shipment #${cancelled.id}.`,
        userId: cancelled.userId,
        shipmentId: cancelled.id,
      },
    });

    res.json(cancelled);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel shipment', details: error });
  }
};


