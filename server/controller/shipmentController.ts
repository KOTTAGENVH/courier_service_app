// controllers/shipmentController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateShipmentDto,
  UpdateShipmentStatusDto,
  CancelShipmentDto,
  ShipmentStatus,
} from '../dto/shipDto.js';

const prisma = new PrismaClient();

function generateRandomString(length: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

//Unique cus Shipping ID
function generateShippingId(): string {
  const prefix = generateRandomString(4);
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}`;
}


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
    const user = await prisma.user.findUnique({ where: { email: dto.userEmail } });
    if (!user) {
      res.status(404).json({ error: 'No such user' });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (user.email !== req.userEmail) {
      res.status(403).json({ error: 'Cannot create shipment for another user' });
      return;
    }
    const shippingId = generateShippingId();
    const shipment = await prisma.shipment.create({
      data: {
        shippingId: shippingId,
        senderAddress: dto.senderAddress,
        receiverFirstName: dto.receiverFirstName,
        receiverLastName: dto.receiverLastName,
        receiverAddress: dto.receiverAddress,
        receiverTelephone: dto.receiverTelephone,
        userId: user.id,
        weight: dto.weight,
      },
    });

    await prisma.notification.create({
      data: {
        title: 'Shipment Created',
        description: `Shipment #${shipment.id} has been created.`,
        userId: user.id,
        shipmentId: shipment.id,
      },
    });

    res.status(201).json(shipment);
  } catch (error) {
    console.error('addShipment error:', error);
    res.status(500).json({ error: 'Failed to create shipment', details: error });
  }
};

// Get all shipments (admin)
export const getAllShipmentsAdmin = async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (req.userEmail !== process.env.ADMIN_EMAIL) {
      res.status(403).json({ error: 'Only admin has access to get all shipments' });
      return;
    }
    const shipments = await prisma.shipment.findMany({
      select: {
        shippingId: true,
        senderAddress: true,
        receiverFirstName: true,
        receiverLastName: true,
        receiverAddress: true,
        receiverTelephone: true,
        weight: true,
        status: true,
        requestCancel: true,
        placedDate: true,
        collectedDate: true,
        shippedDate: true,
        completedDate: true,
        canceledDate: true,
        delayFlag: true,
        notifications: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            viewed: true,
          }
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    res.json({
      ReturnMessage: {
        shippingItems: shipments,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipments', details: error });
  }
};

// Get all shipments for a user
export const getAllShipmentsUser = async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const email = req.userEmail;
  if (!email) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const shipments = await prisma.shipment.findMany({
      select: {
        shippingId: true,
        senderAddress: true,
        receiverFirstName: true,
        receiverLastName: true,
        receiverAddress: true,
        receiverTelephone: true,
        weight: true,
        status: true,
        requestCancel: true,
        placedDate: true,
        collectedDate: true,
        shippedDate: true,
        completedDate: true,
        canceledDate: true,
        delayFlag: true,
        notifications: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            viewed: true,
          }
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    res.json({
      ReturnMessage: {
        shippingItems: shipments,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user shipments', details: error });
  }
};

// Get shipment by ID (admin)
export const getShipmentByIdAdmin = async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (req.userEmail !== process.env.ADMIN_EMAIL) {
      res.status(403).json({ error: 'Only admin has access to get shipment by ID' });
      return;
    }

    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'shippingId parameter is required' });
      return;
    }
    const shipment = await prisma.shipment.findUnique({
      where: { shippingId: id },
      select: {
        shippingId: true,
        senderAddress: true,
        receiverFirstName: true,
        receiverLastName: true,
        receiverAddress: true,
        receiverTelephone: true,
        weight: true,
        status: true,
        requestCancel: true,
        placedDate: true,
        collectedDate: true,
        shippedDate: true,
        completedDate: true,
        canceledDate: true,
        delayFlag: true,
        notifications: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            viewed: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!shipment) {
      res.status(404).json({ error: 'Shipment not found' });
      return;
    }

    res.json({
      ReturnMessage: {
        shippingItem: shipment,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipment', details: error });
  }
};

// Get shipment by ID for a user
export const getShipmentByIdUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const email = req.userEmail;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const shipment = await prisma.shipment.findUnique({
      where: { shippingId: id },
      select: {
        shippingId: true,
        senderAddress: true,
        receiverFirstName: true,
        receiverLastName: true,
        receiverAddress: true,
        receiverTelephone: true,
        weight: true,
        status: true,
        requestCancel: true,
        placedDate: true,
        collectedDate: true,
        shippedDate: true,
        completedDate: true,
        canceledDate: true,
        delayFlag: true,
        notifications: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            viewed: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!shipment) {
      res.status(404).json({ error: 'Shipment not found' });
      return;
    }

    res.json({
      ReturnMessage: {
        shippingItem: shipment,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipment', details: error });
  }
};

// Update shipment status (admin)
export const updateShipmentStatus = async (req: Request, res: Response) => {
  // 1) validate body
  const dto = await validateDto(UpdateShipmentStatusDto, req.body, res);
  if (!dto) return;

  // 2) admin guard
  // @ts-expect-error injected by your auth middleware
  if (req.userEmail !== process.env.ADMIN_EMAIL) {
    res.status(403).json({ error: 'Only admins may update shipment status' });
    return;
  }

  // 3) ID check + lookup
  const shippingId = req.params.id;
  if (!shippingId) {
    res.status(400).json({ error: 'Missing shipment ID in URL' });
    return;
  }
  const shipment = await prisma.shipment.findUnique({ where: { shippingId } });
  if (!shipment) {
    res.status(404).json({ error: `Shipment ${shippingId} not found` });
    return;
  }

  // 4) coerce & validate incoming status
  const newStatus = dto.status as ShipmentStatus;
  if (!Object.values(ShipmentStatus).includes(newStatus)) {
    res.status(400).json({ error: `Invalid status value: ${dto.status}` });
    return;
  }

  // 5) prevent no-op
  if (shipment.status === newStatus) {
    res.status(400).json({ error: `Shipment is already ${newStatus}` });
    return;
  }

  // 6) enforce allowed transitions
  const allowed: Record<ShipmentStatus, ShipmentStatus[]> = {
    [ShipmentStatus.PENDING]: [ShipmentStatus.ON_ROUTE_TO_COLLECT, ShipmentStatus.CANCELED],
    [ShipmentStatus.ON_ROUTE_TO_COLLECT]: [ShipmentStatus.COLLECTED, ShipmentStatus.CANCELED],
    [ShipmentStatus.COLLECTED]: [ShipmentStatus.SHIPPED, ShipmentStatus.CANCELED],
    [ShipmentStatus.SHIPPED]: [ShipmentStatus.COMPLETED, ShipmentStatus.CANCELED],
    [ShipmentStatus.COMPLETED]: [],
    [ShipmentStatus.CANCELED]: [],
  };
  if (!allowed[shipment.status].includes(newStatus)) {
    res.status(400).json({
      error: `Cannot change status from ${shipment.status} to ${newStatus}`
    });
    return;
  }

  // 7) map to date field
  const dateField: Partial<Record<ShipmentStatus, keyof typeof shipment>> = {
    [ShipmentStatus.ON_ROUTE_TO_COLLECT]: 'collectedDate',
    [ShipmentStatus.COLLECTED]: 'collectedDate',
    [ShipmentStatus.SHIPPED]: 'shippedDate',
    [ShipmentStatus.COMPLETED]: 'completedDate',
    [ShipmentStatus.CANCELED]: 'canceledDate',
  };
  const updateData: Record<string, unknown> = { status: newStatus };
  const dateKey = dateField[newStatus];
  if (dateKey) updateData[dateKey] = new Date();

  // 8) update + notification
  try {
    const updated = await prisma.shipment.update({
      where: { shippingId },
      data: updateData,
    });

    await prisma.notification.create({
      data: {
        title: 'Status Updated',
        description: `Shipment #${updated.shippingId} status changed to ${updated.status}.`,
        userId: updated.userId,
        shipmentId: updated.id,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('updateShipmentStatus error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Cancel shipment (user) during pending
export const cancelShipmentUser = async (req: Request, res: Response) => {
  const dto = await validateDto(CancelShipmentDto, req.body, res);
  if (!dto) return;

  // @ts-expect-error injected by your auth middleware
  const email = req.userEmail;
  const shippingId = req.params.id;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const userId = user.id;

    const shipment = await prisma.shipment.findUnique({
      where: { shippingId },
      include: { user: true }
    });
    if (!shipment || shipment.userId !== userId) {
      res.status(404).json({ error: 'Shipment not found' });
      return;
    }

    let updatedShipment;

    if (shipment.status === ShipmentStatus.PENDING) {
      updatedShipment = await prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          status: ShipmentStatus.CANCELED,
          canceledDate: new Date()
        }
      });

      await prisma.notification.create({
        data: {
          title: 'Shipment Cancelled',
          description: `You have cancelled shipment #${updatedShipment.shippingId}.`,
          userId,
          shipmentId: updatedShipment.id
        }
      });

      res.json(updatedShipment);
      return;
    } else {
      updatedShipment = await prisma.shipment.update({
        where: { id: shipment.id },
        data: { requestCancel: true }
      });

      await prisma.notification.create({
        data: {
          title: 'Cancel Request Submitted',
          description: `You have requested cancellation for shipment #${updatedShipment.shippingId}.`,
          userId,
          shipmentId: updatedShipment.id
        }
      });

      res.json(updatedShipment);
      return;
    }

  } catch (error) {
    console.error('cancelShipmentUser error:', error);
    res.status(500).json({ error: 'Failed to cancel shipment', details: error });
  }
};

// Flag delay (user)
export const flagShipmentDelay = async (req: Request, res: Response) => {

  // @ts-expect-error injected by your auth middleware
  const email: string = req.userEmail;
  const shippingId: string = req.params.id;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const userId = user.id;

    const shipment = await prisma.shipment.findUnique({ where: { shippingId } });
    if (!shipment || shipment.userId !== userId) {
      res.status(404).json({ error: 'Shipment not found or not yours' });
      return;
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipment.id },
      data: { delayFlag: !shipment.delayFlag },
    });

    await prisma.notification.create({
      data: {
        title: 'Delay Flagged',
        description: `Shipment #${updatedShipment.shippingId} delay flag set to ${!shipment.delayFlag}.`,
        userId,
        shipmentId: updatedShipment.id,
      },
    });

    res.json({
      shippingId: updatedShipment.shippingId,
      delayFlag: updatedShipment.delayFlag,
    });

  } catch (error) {
    console.error('flagShipmentDelay error:', error);
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


