const asyncHandler = require('express-async-handler');
const { Inventory } = require('../models/inventoryModel');

//get all inventory
//routes GET /api/inventory
//api private access
const getAllInventory = asyncHandler(async (req, res) => {

    //user only gets to get an inventory if they are astaff
     if(req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to update a patient`});
    }
    try{
        const items = await Inventory.find({});
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({message: `Error fetching inventory
        `});
    }
});
//create an inventory item
//routes POST /api/inventory
//api private access
const createInventory = asyncHandler(async(req, res) => {
    try{
        const { name, description, quantity, price, supplier } = req.body;
    if(!name || !description || !quantity || !price || !supplier) {
        return res.status(400).json({message: `All fields are mandatory`});
    }
    const newItem = await Inventory.create({
        name,
        description,
        quantity,
        supplier,
        price
    });
    return res.status(201).json(newItem);
    } catch (error) {
        return res.status(500).json({message: `Server error`});
    }
});

//get a specific inventory item by id
//routes GET /api/inventory/:id
//api private access
const getInventoryById = asyncHandler(async(req, res) => {
     //user only gets to get an inventory if they are astaff
     if(req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to update a patient`});
    }
    try{
        const item = await Inventory.findByPk(req.params.id);
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({message: `Error fetching item`});
    }
})

//update an inventory item
//routes PUT /api/inventory/:id
//api private access
const updateInventory = asyncHandler(async(req, res) => {
    //user only gets to get an inventory if they are astaff
    if(req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to update a patient`});
    }
    try{
        const item = await Inventory.findByPk(req.params.id);
        if(!item) {
            return res.status(404).json({message: `Item not found`});
        }
        const { name, description, quantity, price, supplier } = req.body;
        if(!name || !description || !quantity || !price || !supplier) {
            return res.status(400).json({message: `All fields are mandatory`});
        }
        const updatedItem = await Inventory.findByAndUpdate({
            name,
            description,
            quantity,
            supplier,
            price
        });
        return res.status(200).json(updatedItem);
    } catch (error) {
        return res.status(500).json({message: `Server error`});
    }
});

//delete an inventory item
//routes DELETE /api/inventory/:id
//api private access
const deleteInventory = asyncHandler(async(req, res) => {
    //user only gets to delete an inventory if they are staff
if(req.user.role !== `staff`){
    return res.status(401).json({message: `Not authorized to delete an item`});
}
try{
    const item = await Inventory.findByPk(req.params.id);
    if(!item) {
        return res.status(404).json({message: `Item not found`});
    }
    await item.delete();
    return res.status(200).json({message: `Item removed`});
} catch (error) {
    return res.status(500).json({message: `Server error`});
}
});

//update an inventory item status
//routes PUT /api/inventory/:id/status
//api private access
const updateInventoryStatus = asyncHandler(async(req, res) => {
    //user only gets to get an inventory if they are astaff
    if(req.user.role !== 'staff') {
        return res.status(401).json({message: `Not authorized to update a patient`});
    }
    try{
        const item = await Inventory.findByPk(req.params.id);
        if(!item) {
            return res.status(404).json({message: `Item not found`});
        }
        const { status } = req.body;
        if(!status) {
            return res.status(400).json({message: `Status is mandatory`});
        }
        item.status = status;
        await item.save();
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({message: `Server error`});
    }
});

module.exports = { getAllInventory, createInventory, getInventoryById, updateInventory, deleteInventory, updateInventoryStatus };