import express from "express"

const app= express()

const port= process.env.PORT;
app.listen(port, ()=>{

    console.log(`app is up and listening to port ${port}`)
})