const express = require("express");
const {
  validateRfid,
  getAllRfids,
  removeRfid,
  assignRfidToUser,
  permissionRfid,
  desAssignRfidToUser,
  createRfid,
} = require("./utils/rfid");
const validateRequestBody = require("../../../helpers/validate/fields");
const verifyUser = require("../../auth/auth/utils/auth");
const logger = require("../../../middlewares/logger/logger");

const router = new express.Router();

router.post("/door", async (req, res) => {
  const { rfid } = req.body;
  if (!rfid) {
    return res.status(400).json({ error: "rfid is required" });
  }
  try {
    const isValid = await validateRfid(rfid);
    if (isValid) {
      return res.status(200).json({ message: "Door open" });
    } else {
    res.status(401).json({ message: "não autorizado skibidi" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

router.post("/assign", async (req, res) => {
  const { rfid, userId } = req.body;

  const error = validateRequestBody(["rfid", "userId"], req.body);
  if (error) {
    return res.status(400).json({ error: error, req: req.body });
  }
  try {
    const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
    if (!isVerify || !isSuper) {
      return res.status(403).json({ error: "User no have permision" });
    }
    const isAssigned = await assignRfidToUser(rfid, Number(userId));
    if (isAssigned) {
      return res
        .status(200)
        .json({ message: "RFID assigned to user successfully" });
    }
    res.status(401).json({ message: "RFID not assigned" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/desassign", async (req, res) => {
  const { rfid, userId } = req.body;

  const error = validateRequestBody(["rfid", "userId"], req.body);
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
      return res
        .status(200)
        .json({ message: "RFID desassigned to user successfully" });
    }
    res.status(401).json({ message: "RFID not desassigned" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ error: "User not provided" });
  }
  try {
    const { isVerify } = await verifyUser.verifyUser(req.user);
    if (!isVerify) {
      return res.status(403).json({ error: "User no have permision" });
    }
    const allRfids = await getAllRfids();
    res.status(200).json({ data: allRfids });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/:rfid", async (req, res) => {
  const { rfid } = req.params;

  try {
    // const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
    // if (!isVerify || !isSuper) {
    //   return res.status(403).json({ error: "User no have permision" });
    // }
    const isValid = await createRfid(rfid);

    if (!isValid) {
      return res.status(409).json({ message: "RFID already exists" });
    }
    res.status(201).json({ message: "RFID created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
    if (!isVerify || !isSuper) {
      return res.status(403).json({ error: "User no have permission" });
    }
    const updatedRfid = await permissionRfid(Number(id));
    res
      .status(200)
      .json({ message: "RFID updated successfully", data: updatedRfid });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
