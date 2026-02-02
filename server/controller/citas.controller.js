import db from "../config/db.js";

export const getCitas = async (req, res) => {
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_USER);
  console.log(process.env.DB_PASSWORD);
  console.log(process.env.DB_NAME);
  try {
    const [rows] = await db.query("SELECT * FROM citas");
    res.json(rows);
  } catch (error) {
    console.log("Error->", error);
    res.status(500).json({ error: error.message });
  }
};
