//consultas a la bdd
import { client } from "../db/connection.js";

const db = client.db("UA-bdd");

export const getAllUsers = async () => {
    return await db.collection("User").find().toArray();
};

export const createUser = async (userData) => {
    return await db.collection("User").insertOne(userData);
};
