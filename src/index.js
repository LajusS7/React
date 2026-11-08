
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicFolder = path.join(__dirname, "..");

app.use(express.json());
app.use(express.static(publicFolder));

const client = new MongoClient(process.env.MONGODB_URI);

async function startServer() {
    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME);
        const items = db.collection("missions");

        // GET all missions
        app.get("/api/items", async (req, res) => {
            try {
                const results = await items.find().toArray();
                res.json(results);
            } catch (error) {
                res.status(500).json({ error: "Could not retrieve missions." });
            }
        });

        // GET one mission
        app.get("/api/items/:id", async (req, res) => {
            try {
                if (!ObjectId.isValid(req.params.id)) {
                    return res.status(404).json({ error: "Mission not found." });
                }

                const result = await items.findOne({
                    _id: new ObjectId(req.params.id)
                });

                if (!result) {
                    return res.status(404).json({ error: "Mission not found." });
                }

                res.json(result);
            } catch (error) {
                res.status(500).json({ error: "Could not retrieve mission." });
            }
        });

        // POST a new mission
        app.post("/api/items", async (req, res) => {
            try {
                const { name, character, done } = req.body;

                if (
                    typeof name !== "string" || name.trim() === "" ||
                    typeof character !== "string" ||
                    !["Nero", "Dante"].includes(character)
                ) {
                    return res.status(400).json({
                        error: "A mission name and valid character are required."
                    });
                }

                const newMission = {
                    name: name.trim(),
                    character,
                    done: typeof done === "boolean" ? done : false
                };

                const result = await items.insertOne(newMission);

                res.status(201).json({
                    _id: result.insertedId,
                    ...newMission
                });
            } catch (error) {
                res.status(500).json({ error: "Could not create mission." });
            }
        });

        // PUT update a mission
        app.put("/api/items/:id", async (req, res) => {
            try {
                if (!ObjectId.isValid(req.params.id)) {
                    return res.status(404).json({ error: "Mission not found." });
                }

                const updates = {};
                const { name, character, done } = req.body;

                if (name !== undefined) {
                    if (typeof name !== "string" || name.trim() === "") {
                        return res.status(400).json({ error: "Invalid mission name." });
                    }
                    updates.name = name.trim();
                }

                if (character !== undefined) {
                    if (!["Nero", "Dante"].includes(character)) {
                        return res.status(400).json({ error: "Invalid character." });
                    }
                    updates.character = character;
                }

                if (done !== undefined) {
                    if (typeof done !== "boolean") {
                        return res.status(400).json({ error: "Invalid completion status." });
                    }
                    updates.done = done;
                }

                if (Object.keys(updates).length === 0) {
                    return res.status(400).json({ error: "No valid fields to update." });
                }

                const result = await items.updateOne(
                    { _id: new ObjectId(req.params.id) },
                    { $set: updates }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: "Mission not found." });
                }

                const updatedMission = await items.findOne({
                    _id: new ObjectId(req.params.id)
                });

                res.json(updatedMission);
            } catch (error) {
                res.status(500).json({ error: "Could not update mission." });
            }
        });

        // DELETE a mission
        app.delete("/api/items/:id", async (req, res) => {
            try {
                if (!ObjectId.isValid(req.params.id)) {
                    return res.status(404).json({ error: "Mission not found." });
                }

                const result = await items.deleteOne({
                    _id: new ObjectId(req.params.id)
                });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: "Mission not found." });
                }

                res.json({ message: "Mission deleted successfully." });
            } catch (error) {
                res.status(500).json({ error: "Could not delete mission." });
            }
        });

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Could not connect to MongoDB:", error.message);
        process.exit(1);
    }
}

startServer();
