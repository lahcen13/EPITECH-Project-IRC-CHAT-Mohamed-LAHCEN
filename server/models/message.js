// import {client} from "../MongoDB";
const { client } = require("../MongoDB")
const insertMessage = async (message) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("message");
            const result = await collection.insertOne(message)
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const deleteMessage = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("message");
            const result = await collection.deleteOne({ _id: id })
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const updateMessage = async (pseudo, newPseudo) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("message");
            const result = await collection.updateMany({ author: pseudo }, { $set: { author: newPseudo } });
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const selectAllChannelMessages = async (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("message");
            const result = await collection.find({ room: name });
            const msgArray = [];
            await result.forEach((e) => {
                msgArray.push(e)
            })
            resolve(msgArray)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}


module.exports = { insertMessage, deleteMessage, updateMessage, selectAllChannelMessages }