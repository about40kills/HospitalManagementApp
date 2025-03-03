const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateToken');

const {  getAllInventory, createInventory, getInventoryById, updateInventory, deleteInventory, updateInventoryStatus } = require('../controllers/inventoryControllers');
router.use(validateToken);

//get all inventory items
router.route('/').get(getAllInventory);

//create an inventory item
router.route('/').post(createInventory);

//get a specific inventory item by id
router.route('/:id').get(getInventoryById);

//update an inventory item
router.route('/:id').put(updateInventory);

//delete an inventory item
router.route('/:id').delete(deleteInventory);

//update an inventory item status
router.route('/:id/status').put(updateInventoryStatus);