const express = require('express');
const axios = require('axios');

const app = express()
const port = 8081

const patients = [
    {patientId: 1, name: "lucas", age: 23, disease: "diabetic" },
    {patientId: 2, name: "thomas", age: 17, diesase: "ADHD"}
]

app.get('/patient/:id', (req, res) => {
    res.send(patients.find((patient) => patient.patientId == req.params.id))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})