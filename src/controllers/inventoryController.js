'use strict'

const InventoryService = require("../services/inventoryService")
const {SuccessResponse} = require('../core/successResponse')

class InventoryController {

    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add stock to inventory successfully!',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController()