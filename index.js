const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const nodemailer=require('nodemailer')
const multiparty = require("multiparty");
const path =require('path')
require("dotenv").config();
const app=express()
const staticFiles = express.static(path.join(__dirname + "./public/build"));

app.use(staticFiles);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/build", "index.html"));
// });
app.post('/api/form',(req,res)=>{
    let data =req.body;
    //transporter object
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  const mail = {
    from: data.name,
    to: process.env.EMAIL,
    subject: data.subject,
    text: `${data.name} <${data.email}> \n${data.message}`,
  };
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Something went wrong.");
    } else {
      res.status(200).send("Email successfully sent to recipient!");
    }
  });
})

//port will be 3001 for testing
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
console.log(`Listening on port ${PORT}...`);
});
