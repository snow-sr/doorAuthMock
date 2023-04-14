var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { checkRfid } from "./db.js";
import express from "express";
import bp from "body-parser";
const port = 8087;
const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Basic door api");
});
app.post("/door", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Rfid = req.body.rfid;
    const check = yield checkRfid(Rfid);
    if (check) {
        res.send("Door open");
    }
    else {
        res.status(401).send("Door closed");
    }
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map