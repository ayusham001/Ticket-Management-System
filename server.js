const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const multer = require("multer");
const fs = require('fs')
const upload = multer({ dest: "uploads/" });
const db = require("./models/db");
const Model = require("./models/Users");
const models = require("./models/Models");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const UserModel = Model.User;
const AdminModel = Model.Admin;
const returnTicket = models.returnTicket;
const replaceTicket = models.replaceTicket;
const TechnicalIssues = models.Technical_Issues;
const HelpSupport = models.Help_Support;
const SalesSupport = models.Sales_Support;
const Others = models.Others;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("uploads"));
app.use(
  session({
    secret: "helloboss",
    resave: false,
    saveUninitialized: true,
  })
);


io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', { message: msg.message, file: msg.file || '' }); // Provide an empty string if file is not provided
  });
});




app.get('/adminHome', (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("adminlogin", { error: null })
    return;
  }
  const user = req.session.user;
  const user_name = req.session.user.name;
  const pic = req.session.user.profilePic;
  res.render("adminHome", { name: user_name, pic: pic, user: user })
});


app.get('/', (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("login", { error: null })
    return;
  }
  const user_name = req.session.user.name;
  const pic = req.session.user.profilePic;
  res.render("index", { name: user_name, pic: pic })
});


app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/script.js");
});


app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/style.css");
});


app.get("/login", (req, res) => {
  res.render("login", { error: null });
});


app.get("/adminlogin", (req, res) => {
  res.render("adminlogin", { error: null });
});


app.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});


app.get("/admin_open_tickets", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("adminlogin", { error: 'You need to login First' })
    return;
  }
  try {
    const ticketList = [];
    const category = req.session.user.category;

    if (category === 'Return') {
      const returnTickets = await returnTicket.find({status: 'open'});
      if (returnTickets.length > 0) {
        ticketList.push(...returnTickets);
      }
    }

    else if (category === 'Replace') {
      const replaceTickets = await replaceTicket.find({status: 'open'});
      if (replaceTickets.length > 0) {
        ticketList.push(...replaceTickets);
      }
    }
    else if (category === 'Technical Issues') {
      const TechnicalIssue = await TechnicalIssues.find({status: 'open'});
      if (TechnicalIssue.length > 0) {
        ticketList.push(...TechnicalIssue);
      }
    }

    else if (category === 'Help and Support') {
      const Helpsupport = await HelpSupport.find({status: 'open'});
      if (Helpsupport.length > 0) {
        ticketList.push(...Helpsupport);
      }
    }

    else if (category === 'Sales Support') {
      const Salessupport = await SalesSupport.find({status: 'open'});
      if (Salessupport.length > 0) {
        ticketList.push(...Salessupport);
      }
    }
    else {
      const Other = await Others.find({status: 'open'});
      if (Other.length > 0) {
        ticketList.push(...Other);
      }
    }
    if (ticketList.length === 0) {
      res.status(200).send(JSON.stringify([]));
    } else {
      res.status(200).send(JSON.stringify(ticketList));
    }

  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).send("Error fetching tickets");
  }
});


app.get("/admin_tickets", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("adminlogin", { error: 'You need to login First' })
    return;
  }
  try {
    const ticketList = [];
    const category = req.session.user.category;

    if (category === 'Return') {
      const returnTickets = await returnTicket.find({});
      if (returnTickets.length > 0) {
        ticketList.push(...returnTickets);
      }
    }

    else if (category === 'Replace') {
      const replaceTickets = await replaceTicket.find({});
      if (replaceTickets.length > 0) {
        ticketList.push(...replaceTickets);
      }
    }
    else if (category === 'Technical Issues') {
      const TechnicalIssue = await TechnicalIssues.find({});
      if (TechnicalIssue.length > 0) {
        ticketList.push(...TechnicalIssue);
      }
    }

    else if (category === 'Help and Support') {
      const Helpsupport = await HelpSupport.find({});
      if (Helpsupport.length > 0) {
        ticketList.push(...Helpsupport);
      }
    }

    else if (category === 'Sales Support') {
      const Salessupport = await SalesSupport.find({});
      if (Salessupport.length > 0) {
        ticketList.push(...Salessupport);
      }
    }
    else {
      const Other = await Others.find({});
      if (Other.length > 0) {
        ticketList.push(...Other);
      }
    }
    if (ticketList.length === 0) {
      res.status(200).send(JSON.stringify([]));
    } else {
      res.status(200).send(JSON.stringify(ticketList));
    }

  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).send("Error fetching tickets");
  }
});




app.get("/open_tickets", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("login", { error: 'You need to login First' })
    return;
  }
  try {
    const ticketList = [];
    const email = req.session.user.email;

    const returnTickets = await returnTicket.find({ email: email, status: 'open' });
    if (returnTickets.length > 0) {
      ticketList.push(...returnTickets);
    }

    const replaceTickets = await replaceTicket.find({ email: email, status: 'open' });
    if (replaceTickets.length > 0) {
      ticketList.push(...replaceTickets);
    }

    const TechnicalIssue = await TechnicalIssues.find({ email: email, status: 'open' });
    if (TechnicalIssue.length > 0) {
      ticketList.push(...TechnicalIssue);
    }

    const Helpsupport = await HelpSupport.find({ email: email, status: 'open' });
    if (Helpsupport.length > 0) {
      ticketList.push(...Helpsupport);
    }

    const Salessupport = await SalesSupport.find({ email: email, status: 'open' });
    if (Salessupport.length > 0) {
      ticketList.push(...Salessupport);
    }

    const Other = await Others.find({ email: email, status: 'open' });
    if (Other.length > 0) {
      ticketList.push(...Other);
    }

    if (ticketList.length === 0) {
      res.status(200).send(JSON.stringify([]));
    } else {
      res.status(200).send(JSON.stringify(ticketList));
    }

  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).send("Error fetching tickets");
  }
});


app.get("/tickets", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("login", { error: 'You need to login First' })
    return;
  }
  try {
    const ticketList = [];
    const email = req.session.user.email;

    const returnTickets = await returnTicket.find({ email: email });
    if (returnTickets.length > 0) {
      ticketList.push(...returnTickets);
    }

    const replaceTickets = await replaceTicket.find({ email: email });
    if (replaceTickets.length > 0) {
      ticketList.push(...replaceTickets);
    }

    const TechnicalIssue = await TechnicalIssues.find({ email: email });
    if (TechnicalIssue.length > 0) {
      ticketList.push(...TechnicalIssue);
    }

    const Helpsupport = await HelpSupport.find({ email: email });
    if (Helpsupport.length > 0) {
      ticketList.push(...Helpsupport);
    }

    const Salessupport = await SalesSupport.find({ email: email });
    if (Salessupport.length > 0) {
      ticketList.push(...Salessupport);
    }

    const Other = await Others.find({ email: email });
    if (Other.length > 0) {
      ticketList.push(...Other);
    }

    if (ticketList.length === 0) {
      res.status(200).send(JSON.stringify([]));
    } else {
      res.status(200).send(JSON.stringify(ticketList));
    }

  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).send("Error fetching tickets");
  }
});




app.get("/ticket-list", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("login", { error: 'You need to login First' });
    return;
  }
  const user_name = req.session.user.name;
  const pic = req.session.user.profilePic;
  res.render("ticket-list", { name: user_name, pic: pic, message: null })
});



app.get("/admin-ticket-list", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("adminlogin", { error: 'You need to login First' });
    return;
  }
  const user_name = req.session.user.name;
  const pic = req.session.user.profilePic;
  res.render("admin-ticket-list", { name: user_name, pic: pic, message: null })
});



app.get("/create-ticket", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("login", { error: 'You need to login First' })
    return;
  }
  const user_name = req.session.user.name;
  const pic = req.session.user.profilePic;
  res.render("create-ticket", { name: user_name, pic: pic, message: null })
});


app.get("/edit-profile", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("login", { error: 'You need to login First' })
    return;
  }
  const user_name = req.session.user.name;
  const user = req.session.user;
  const pic = req.session.user.profilePic;
  res.render("edit-profile", { name: user_name, pic: pic, user: user, error: null })
});



app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(er);
    } else {
      res.render("login", { error: 'Logout Successfully!!!' });
    }
  });
});



app.post("/create-ticket", async (req, res) => {
  const { title, productId, category, priority, discription } = req.body;
  try {
    if (!req.session.isLoggedIn) {
      res.render("login", { error: 'You need to login First' })
      return;
    } else {
      const name = req.session.user.name;
      const username = req.session.user.username;
      const email = req.session.user.email;
      const profilePic = req.session.user.profilePic;
      const date = new Date().toISOString().split('T')[0];
      const status = 'open';
      const ticket = { username, name, email, profilePic, title, productId, status, date, category, priority, discription };
      if (category === "Return") {
        await returnTicket.create(ticket);
      }
      else if (category === "Replace") {
        await replaceTicket.create(ticket);
      }
      else if (category === "Technical Issues") {
        await TechnicalIssues.create(ticket);
      }
      else if (category === "Help and Support") {
        await HelpSupport.create(ticket);
      }
      else if (category === "Sales Support") {
        await SalesSupport.create(ticket);
      }
      else {
        await Others.create(ticket);
      }
      res.render("create-ticket", { name: name, pic: profilePic, message: "Ticket Raised Sucessfully" });
    }
  } catch (err) {
    console.log(err);
    const user_name = req.session.user.name;
    const pic = req.session.user.profilePic;
    res.render("create-ticket", { name: user_name, pic: pic, message: "Technical error Please try again" });

  }
})


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({
    $or: [
      { username: username, password: password },
      { email: username, password: password }
    ]
  }).then((user) => {
    if (user) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
      return;
    } else {
      res.render('login', { error: 'Enter valid credentials' });
    }
  }).catch((err) => {
    res.render('login', { error: 'Something went wrong' });
  })
});


app.post('/adminlogin', (req, res) => {
  const { username, password } = req.body;
  AdminModel.findOne({
    $or: [
      { username: username, password: password },
      { email: username, password: password }
    ]
  }).then((user) => {
    if (user) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/adminHome');
      return;
    } else {
      res.render('adminlogin', { error: 'Enter valid credentials' });
    }
  }).catch((err) => {
    res.render('adminlogin', { error: 'Something went wrong' });
  })
});



function isUserExisting(username, email) {
  return UserModel.exists({ $or: [{ username }, { email }] });
}

app.post("/update-profile", upload.single("pic"), async (req, res) => {
  const { username, password, name } = req.body;
  const pic = req.file;
  const profilePic = pic.filename;
  const oldUsername = req.session.user.username;
  const email = req.session.user.email;
  const oldpic = req.session.user.profilePic;
  try {
    if (oldUsername != username) {
      const userExists = await isUserExisting(username, null);
      if (userExists) {
        const user_name = req.session.user.name;
        const pic = req.session.user.profilePic;
        const user = req.session.user;
        res.render("edit-profile", {
          name: user_name, pic: pic, user: user,
          error: "User with same username already exists",
        });
      } else {
        const newUser = { username, password, name, email, profilePic };
        await UserModel.updateOne({ email: email }, newUser);
        fs.unlinkSync(`uploads/${oldpic}`);
        req.session.user = newUser;
        const user_name = req.session.user.name;
        const user = req.session.user;
        const pic = req.session.user.profilePic;
        res.render("edit-profile", { name: user_name, pic: pic, user: user, error: "Profile Updated successfully!!!!" });
      }
    }
    else {
      const newUser = { username, password, name, email, profilePic };
      await UserModel.updateOne({ email: email }, newUser);
      fs.unlinkSync(`uploads/${oldpic}`);
      req.session.user = newUser;
      const user_name = req.session.user.name;
      const user = req.session.user;
      const pic = req.session.user.profilePic;
      res.render("edit-profile", { name: user_name, pic: pic, user: user, error: "Profile Updated successfully!!!!" });

    }
  } catch (err) {
    console.log(err);
    const user_name = req.session.user.name;
    const user = req.session.user;
    const pic = req.session.user.profilePic;
    res.render("edit-profile", { name: user_name, pic: pic, user: user, error: "Profile updation failed" });
  }
}
);

app.post("/signup", upload.single("pic"), async (req, res) => {
  const { username, password, name, email} = req.body;
  const pic = req.file;
  const profilePic = pic.filename;

  try {
    const userExists = await isUserExisting(username, email);
    if (userExists) {
      res.render("signup", {
        error: "User with same username or email already exists",
      });
    } else {
      const newUser = { username, password, name, email, profilePic };
      await UserModel.create(newUser);
      res.render("login", { error: "Account created successfully!!!!" });
    }
  } catch (err) {
    console.log(err);
    res.render("signup", { error: "Account creation failed" });
  }
});

db.init()
  .then(() => {
    console.log("db connected");
    server.listen(3000, () => {
      console.log("server started at 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
