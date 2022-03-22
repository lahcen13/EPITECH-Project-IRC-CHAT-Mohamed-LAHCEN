// import {client} from "../MongoDB";
const { client } = require("../MongoDB")

const insertUser = async (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("user");
            const result = await collection.insertOne(user)
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const deleteUser = async (pseudo) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("user");
            const result = await collection.deleteOne({ pseudo: pseudo })
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const updateUser = async (pseudo, newUserData) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("user");
            const result = await collection.updateOne({ pseudo: pseudo }, { $set: { pseudo: newUserData } })
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const selectUser = async (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("user");
            const result = await collection.findOne(user)
            console.log(result);
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const selectChannelUsers = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("user");
            const result = await collection.find({ userChannels: id })
            console.log(result);
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}


const addUserIntoChannel = async (user, channel) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("user");
            console.log(channel)
            const result = await collection.updateOne(
                { pseudo: user },
                { $addToSet: { channels: channel } }
            )
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

const deleteUserFromChannel = async (user, channel) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const database = client.db("testDB");
            const collection = database.collection("user");
            const result = await collection.updateOne(
                { pseudo: user },
                { $pull: { channels: channel } }
            )
            console.log(result);
            resolve(result)
        } catch (e) {
            reject(e)
        } finally {
            client.close()
        }
    })
}

module.exports = { insertUser, deleteUser, updateUser, selectUser, addUserIntoChannel, deleteUserFromChannel, selectChannelUsers }