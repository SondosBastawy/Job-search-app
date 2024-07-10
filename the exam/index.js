import express from 'express'
import { config } from 'dotenv'




import { dbConnection } from './database/dbConnection.js'
import userRouter from './src/modules/User/user.routes.js'
import { globalResponse } from './src/middlewares/errorHandling.middleware.js'
import companyRouter from './src/modules/Company/company.routes.js'
import jobRouter from './src/modules/job/job.routes.js'


config();

const app = express();

const port = process.env.PORT;


app.use(express.json())

app.use('/auth', userRouter)
app.use('/company', companyRouter)
app.use('/job', jobRouter)
app.use(globalResponse)


dbConnection()


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))