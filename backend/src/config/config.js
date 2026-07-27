if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in inviroment variable")
}
if (!process.env.PORT) {
    throw new Error("PORT is not defined in enviroment veriable/.env 😕😔")
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT
}

export { config } 