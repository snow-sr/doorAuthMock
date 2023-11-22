var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { checkRfid, listAllRfids, createRfid, deleteRfid } from '../db.js';
const router = express.Router();
router.post("/door/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Rfid = req.body.rfid;
    const check = yield checkRfid(Rfid);
    if (check) {
        res.send("Door open");
    }
    else {
        res.status(401).send("Door closed");
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let all = yield listAllRfids();
    res.send(all);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Rfid = req.body.rfid;
    const check = yield checkRfid(Rfid);
    if (check) {
        res.status(401).send("Rfid already exists");
    }
    else {
        res.send(createRfid(Rfid));
    }
}));
router.post("/delete/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Rfid = req.body.rfid;
    const check = yield checkRfid(Rfid);
    if (check) {
        res.send(deleteRfid(Rfid));
    }
    else {
        res.status(401).send("Rfid does not exist");
    }
}));
export default router;
//# sourceMappingURL=rfid.js.map