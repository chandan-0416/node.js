const express = require("express");
// const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");


const app = express();
const PORT = 8000;

//Connection
mongoose
   .connect('mongodb://127.0.0.1:27017/youtube-app-1')
   .then(()=>console.log("MongoDB Connected"))
   .catch((err)=>console.log("Mongo Error", err));


//Schema
const userSchema = new mongoose.Schema({
     firstName:{
      type: String,
      required: true
     },
     lastName: {
        type: String,
     },
     email:{
      type:String,
      required: true,
      unique: true,
     },
     jobTitle:{
      type: String,
     },
     gender: {
      type: String,
     },
}, {timestamps: true});

const User = mongoose.model("user", userSchema);



//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
 fs.appendFile('log.txt', `\n${Date.now()}: ${req.ip} ${req.method}:${req.path}`,
    (err, data)=>{
        next();
    }
 )
});


//Routes
app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name} </li>`).join("")}
    </ul>
    `;
  res.send(html);
});

//REST API
app.get("/api/users", (req, res) => {
  res.setHeader("X-MyName", "Chandan Kushwaha"); //Custom Header
  //Always add X to custom headers

  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id); //id get
    const user = users.find((user) => user.id === id);
    if(!user) return res.status(404).json({error: "User not found"});
    return res.json(user);
  })

  .patch((req, res) => {
    //Edit user with id
    return res.json({ status: "pending" });
  })

  .delete((req, res) => {
    //Delete user with id
    return res.json({ status: "pending" });
  });

app.post("/api/users", async(req, res) => {
  const body = req.body;
  if(!body || !body.first_name || !body.last_name || !body.email || !body.job_title || !body.gender){
   return res.status(400).json({msg: "All fields required..."});
  }
   const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
   });
// console.log(result);
   return res.status(201).json({msg: "success"});

  // users.push({ ...body, id: users.length + 1 });
  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
  //   return res.status(201).json({ status: "success", id: users.length });
  // });
});

app.listen(PORT, () => console.log(`server started! at PORT: ${PORT}`));