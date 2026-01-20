import express from "express";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
    return res.send("Hello, World!");
})

app.listen(3000, () => {
    console.log(`Server is running on PORT ${PORT}`)
})