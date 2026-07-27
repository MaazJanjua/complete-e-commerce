import './bootstrap/env.js'


import { config } from '../src/config/config.js'
import { connectDB } from './database/index.js'
import { app } from './app.js'  

const startServer = async () => {
    try {
        await connectDB()
        app.listen(config.PORT || 8000, () => {
            console.log(`server is runnig ou PORT ${config.PORT}`);
        })
        console.log("Server is ready 🚀");
    } catch (error) {
        console.log("startup error", error);
        process.exit(1)

    }
}
startServer();