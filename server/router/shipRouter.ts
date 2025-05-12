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
import { authMiddleware } from '../middleware/tokenAuthenticate.js';

const shipmentRouter = express.Router();


shipmentRouter.post('/shipments', authMiddleware, addShipment);

// Admin routes
shipmentRouter.get('/admin/shipments', authMiddleware, getAllShipmentsAdmin);
shipmentRouter.get('/admin/shipments/:id', authMiddleware, getShipmentByIdAdmin);
shipmentRouter.patch('/admin/shipments/status/:id', authMiddleware, updateShipmentStatus);
shipmentRouter.delete('/admin/shipments/:id', authMiddleware, cancelShipmentAdmin);

// User routes
shipmentRouter.get('/users/shipments', authMiddleware, getAllShipmentsUser);
shipmentRouter.get('/users/shipments/:id', authMiddleware, getShipmentByIdUser);
shipmentRouter.patch('/users/shipments/cancel/:id', authMiddleware, cancelShipmentUser);
shipmentRouter.patch('/users/shipments/delay/:id', authMiddleware, flagShipmentDelay);

export default shipmentRouter;