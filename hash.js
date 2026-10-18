const bcrypt = require("bcrypt");
const password = "Saifi@02"; 
bcrypt.hash(password, 10).then(hash => console.log(hash));