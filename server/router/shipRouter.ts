import express from 'express';
import {
    addShipment,
    getAllShipmentsAdmin,
    getAllShipmentsUser,
    getShipmentByIdAdmin,
    getShipmentByIdUser,
    updateShipmentStatus,
    cancelShipmentUser,
    flagShipmentDelay,
    cancelShipmentAdmin,
} from '../controller/shipmentController.js';
import { authMiddleware } from '../middleware/tokenAuthenticate';

const shipmentRouter = express.Router();


shipmentRouter.post('/shipments', authMiddleware, addShipment);

// Admin routes
shipmentRouter.get('/admin/shipments', authMiddleware, getAllShipmentsAdmin);
shipmentRouter.get('/admin/shipments/:id', authMiddleware, getShipmentByIdAdmin);
shipmentRouter.patch('/admin/shipments/:id/status', authMiddleware, updateShipmentStatus);
shipmentRouter.delete('/admin/shipments/:id', authMiddleware, cancelShipmentAdmin);

// User routes
shipmentRouter.get('/users/:userId/shipments', authMiddleware, getAllShipmentsUser);
shipmentRouter.get('/users/:userId/shipments/:id', authMiddleware, getShipmentByIdUser);
shipmentRouter.patch('/users/:userId/shipments/:id/cancel', authMiddleware, cancelShipmentUser);
shipmentRouter.patch('/users/:userId/shipments/:id/delay', authMiddleware, flagShipmentDelay);

export default shipmentRouter;