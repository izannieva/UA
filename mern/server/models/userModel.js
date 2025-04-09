//consultas a la bdd
import { ObjectId } from "mongodb";
import { client } from "../db/connection.js";

const db = client.db("UA-bdd");

export const getAllUsers = async () => {
    return await db.collection("User").find().toArray();
};

export const createUser = async (userData) => {
    return await db.collection("User").insertOne(userData);
};

// Obtener usuario por ID
export const getUserById = async (id) => {
    return await db.collection("User").findOne({ _id: new ObjectId(id) });
};

// Actualizar usuario
export const updateUser = async (id, updatedData) => {
    return await db.collection("User").updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
    );
};

// Eliminar usuario
export const deleteUser = async (id) => {
    return await db.collection("User").deleteOne({ _id: new ObjectId(id) });
};