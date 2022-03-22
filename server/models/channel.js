// import {client} from "../MongoDB";
const { client } = require("../MongoDB")
const insertChannel = async (channel) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("channels");
            const result = await collection.insertOne(channel)
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const deleteChannel = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("channels");
            const result = await collection.deleteOne({ id: id })
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const updateChannel = async (pseudo, newPseudo) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("channels");
            const result = await collection.updateMany({ pseudo: pseudo }, { $set: { pseudo: newPseudo } })
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}
const selectAllChannels = async (pseudo) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("channels");
            const result = await collection.find({ pseudo: pseudo })
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            return result;
            client.close()
        }
    })
}

const selectChannel = async (channelName) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("channels");
            const result = await collection.findOne({ channel: channelName })
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const channelBeginWith = async (channelName) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("channels");
            const regex = new RegExp(channelName)
            const result = await collection.find({ "channel": { $regex: regex } })
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

const channelsList = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("channels");
            const result = await collection.find()
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


module.exports = { insertChannel, deleteChannel, updateChannel, selectAllChannels, selectChannel, channelsList, channelBeginWith }