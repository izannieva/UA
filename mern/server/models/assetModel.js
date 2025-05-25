//consultas a la bdd
import { ObjectId } from "mongodb";
import { client } from "../db/connection.js";

const db = client.db("UA-bdd");

export const getAllAssets = async () => {
    return await db.collection("Asset").find().toArray();
};

export const createAsset = async (data) => {
    console.log("Datos que se insertarán en la base de datos:", data); // Log para depuración
    return await db.collection("Asset").insertOne(data);
};

export const getAssetById = async (id) => {
    return await db.collection("Asset").findOne({ _id: new ObjectId(id) });
};

export const deleteAsset = async (id) => {
    return await db.collection("Asset").deleteOne({ _id: new ObjectId(id) });
};

export const updateAsset = async (id, updateData) => {
    const db = client.db("UA-bdd");
    return await db.collection("Asset").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
};

// Likes functions
export const likeAsset = async (assetId, userId) => {
    return await db.collection("Asset").updateOne(
        { _id: new ObjectId(assetId) },
        { $addToSet: { likes: userId } }
    );
};

export const unlikeAsset = async (assetId, userId) => {
    return await db.collection("Asset").updateOne(
        { _id: new ObjectId(assetId) },
        { $pull: { likes: userId } }
    );
};

// Comments functions
export const addComment = async (assetId, comment) => {
    const commentWithId = {
        ...comment,
        _id: new ObjectId(),
        createdAt: new Date()
    };
    
    return await db.collection("Asset").updateOne(
        { _id: new ObjectId(assetId) },
        { $push: { comments: commentWithId } }
    );
};

export const deleteComment = async (assetId, commentId) => {
    return await db.collection("Asset").updateOne(
        { _id: new ObjectId(assetId) },
        { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );
};

// Enhance the incrementViews function
export const incrementViews = async (assetId) => {
    try {
        console.log(`📊 Incrementing view for asset ID: ${assetId}`);
        const objectId = new ObjectId(assetId);
        
        // Initialize views field if it doesn't exist
        const result = await db.collection("Asset").updateOne(
            { _id: objectId },
            { 
                $inc: { views: 1 },
                $setOnInsert: { views: 1 } // This ensures views exists if it doesn't
            },
            { upsert: false }
        );
        
        console.log(`📊 View increment result:`, result);
        return result;
    } catch (error) {
        console.error(`❌ Error incrementing view in DB:`, error);
        throw error;
    }
};

// ✅ Añadido para compatibilidad con assetControllers.js
export const pushCommentToAsset = async (assetId, comment) => {
    return await db.collection("Asset").updateOne(
        { _id: new ObjectId(assetId) },
        { $push: { comments: comment } }
    );
};

export const removeCommentFromAsset = async (assetId, commentId) => {
    return await db.collection("Asset").updateOne(
        { _id: new ObjectId(assetId) },
        { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );
};
