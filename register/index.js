const express = require('express');
const axios = require('axios');

const app = express()
const port = 8080
const PATIENT_ADDRESS = "http://patient-service:8081"
let patients = [
    {patientId: 1, name: "lucas"},
    {patientId: 2, name: "thomas"}
]

// Import patient list
if (process.env.PATIENT_TYPE == "OTHER")
{
  patients = require('/etc/config/'+process.env.PATIENT_LIST_FILE)
}

app.get('/patients', (req, res) => {
  res.send(patients)
})

app.get('/patient/:id', (req, res) => {
  if (process.env.PATIENT_TYPE == "OTHER") {
    res.send(patients.find((patient) => patient.patientId == req.params.id))
  }
  else {
      axios.get(`${PATIENT_ADDRESS}/patient/${req.params.id}`)
      .then(function (response) {
      // handle success
      res.send(response.data)
    })
  }
    
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})