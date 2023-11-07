var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { listAllUser, createUser, assignRfidToUser } from "../db.js";
const router = express.Router();
router.post("/create/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    createUser(name, email);
    res.send("User created");
});
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield listAllUser();
    res.send(users);
}));
router.post("/assign/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rfid = req.body.rfid;
    const email = req.body.email;
    yield assignRfidToUser(rfid, email);
    res.send(`${rfid} assigned to ${email}`);
}));
export default router;
//# sourceMappingURL=user.js.map