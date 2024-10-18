const express = require('express');
const {
  validateRfid,
  getAllRfids,
  removeRfid,
  assignRfidToUser,
  permissionRfid,
  desAssignRfidToUser
} = require("./utils/rfid");
const { validateRequestBody } = require('../../../helpers/validate/fields');
const updateFront = require('../../../helpers/socket/update')
const verifyUser = require('../../Auth/Auth/utils/auth');

const router = new express.Router();

router.post('/door', async (req, res) => {
    const data = req.body;
    try {
        const isValid = await validateRfid(data.rfid);
        if (isValid) {
            return res.status(200).json({ message: 'Door open' });
        }
        updateFront()
        res.status(401).json({ message: 'Door closed' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.post('/assign', async (req, res) => {
    const { rfid, userId } = req.body;

    const error = validateRequestBody(['rfid', 'userId'], req.body);
    if (error) {
        return res.status(400).json({ error });
    }
    try {
        const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
        if (!isVerify || !isSuper) {
          return res.status(403).json({ error: "User no have permision" });
        }
        const isAssigned = await assignRfidToUser(rfid, Number(userId));
        if (isAssigned) {
            return res.status(200).json({ message: 'RFID assigned to user successfully' });
        }
        res.status(401).json({ message: 'RFID not assigned' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.post('/desassign', async (req, res) => {
    const { rfid, userId } = req.body;

    const error = validateRequestBody(['rfid', 'userId'], req.body);
    if (error) {
        return res.status(400).json({ error });
    }
    try {
        const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
        if (!isVerify || !isSuper) {
            return res.status(403).json({ error: "User no have permision" });
        }
        const isDesassigned = await desAssignRfidToUser(rfid, Number(userId));
        if (isDesassigned) {
            return res.status(200).json({ message: 'RFID desassigned to user successfully' });
        }
        res.status(401).json({ message: 'RFID not desassigned' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.get('/', async (req, res) => {
    if (!req.user) {
      return res.status(400).json({ error: "User not provided" });
    }
    try {
        const { isVerify} = await verifyUser.verifyUser(req.user);
        if (!isVerify) {
          return res.status(403).json({ error: 'User no have permision' });
        }
        const allRfids = await getAllRfids();
        res.status(200).json({ data: allRfids });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.post('/:rfid', async (req, res) => {
    const { rfid } = req.params;

    try {
        const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
        if (!isVerify || !isSuper) {
          return res.status(403).json({ error: "User no have permision" });
        }
        const isValid = await validateRfid(rfid);
        if (isValid) {
            return res.status(409).json({ message: 'RFID already exists' });
        }
        res.status(201).json({ message: 'RFID created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
    if (!isVerify || !isSuper) {
      return res.status(403).json({ error: "User no have permision" });
    }
    const deletedRfid = await removeRfid(Number(id));
    res
      .status(200)
      .json({ message: "RFID deleted successfully", data: deletedRfid });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
        if (!isVerify || !isSuper) {
          return res.status(403).json({ error: "User no have permission" });
        }
        const updatedRfid = await permissionRfid(Number(id));
        res.status(200).json({ message: 'RFID updated successfully', data: updatedRfid });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
