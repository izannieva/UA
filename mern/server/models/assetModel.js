//consultas a la bdd
import { ObjectId } from "mongodb";
import { client } from "../db/connection.js";

const db = client.db("UA-bdd");

export const getAllAssets = async () => {
    return await db.collection("Asset").find().toArray();
};

export const createAsset = async (data) => {
    return await db.collection("Asset").insertOne(data);
};
export const getAssetById = async (id) => {
    return await db.collection("Asset").findOne({ _id: new ObjectId(id) });
};
export const deleteAsset = async (id) => {
    return await db.collection("Asset").deleteOne({ _id: new ObjectId(id) });
};