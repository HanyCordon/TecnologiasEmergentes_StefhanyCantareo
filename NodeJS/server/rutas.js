const Router = require("express").Router();
const User = require("./model/user.js");
const Product = require("./model/product.js");
var mongoose = require("mongoose");
var crypto = require("crypto");

function encriptar(user, pass) {
  // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
  var hmac = crypto
    .createHmac("sha1", user)
    .update(pass)
    .digest("hex");
  return hmac;
}

//Crea Usurio 1
Router.get("/CreateUser1", function(req, res) {
  var user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: "user@gmail.com",
    name: "Hzny",
    password: "123456",
    urlAvatar:
      "http://www.indiehoy.com/wp-content/uploads/2017/08/Lemmy-Kilmister.jpg",
    status: "Activo"
  });
  user.password = encriptar(user.email, user.password);
  user.save(function(error) {
    if (error) {
      res.status(500);
      res.json(error);
    }
    res.json(user);
  });
});

//Crea Usuario 2
Router.get("/CreateUser2", function(req, res) {
  var user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: "user2@gmail.com",
    name: "Amon Amarth",
    password: "next",
    urlAvatar:
      "https://diablorock.com/wp-content/uploads/2017/04/IMG_3100-768x506.jpg",
    status: "Activo"
  });
  user.password = encriptar(user.email, user.password);
  user.save(function(error) {
    if (error) {
      res.status(500);
      res.json(error);
    }
    res.json(user);
  });
});

//Crea Productos
Router.get("/CreateProduct", function(req, res) {
  var product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: "SUBARU IMPREZA STI",
    urlImage:
      "http://www.auto-power-girl.com/photo-gallery/subaru-impreza-sti-wrc-2006/2006-subaru-impreza-sti-wrc-9.jpg",
    description: "Automovil Subaru 2.0 turbo, 450hp",
    price: 35000,
    quantity: 7
  });
  product.name = product.name.toUpperCase();
  product.save();

  product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: "DEAN CHICAGO V",
    urlImage:
      "http://img.digimart.net/prdimg/m/48/1d550ad9e1d9877e7a6b05b274a1c645f7bd51.jpg",
    description: "Dean Chicago Cherry, 1988",
    price: 1000,
    quantity: 6
  });
  product.save();

  product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: "BMW R100",
    urlImage:
      "http://static.materialicious.com/images/hookie-co-bmw-r100-o.jpg",
    description: "BMW R100 cafe racer 400cc",
    price: 15000,
    quantity: 6
  });
  product.save();

  product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: "GIBSON LES PAUL",
    urlImage:
      "https://i.pinimg.com/originals/f5/62/fd/f562fda586d05ffef6213d7df9093380.jpg",
    description: "Gibson les paul black custom",
    price: 3000,
    quantity: 9
  });
  product.save();

  product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: "MITSUBISHI EVO VI",
    urlImage: "https://i.redd.it/s0wnmsvrooz01.jpg",
    description: "Mistsubishi Lancer Evolution VI Tomi Makinen",
    price: 60000,
    quantity: 13
  });
  product.save();

  product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: "C3 R5 1.6",
    urlImage:
      "https://i1.wp.com/pitlanef1.es/wp-content/uploads/2018/03/Citro%C3%ABn-C3-R5-Rally-du-Var.jpg?fit=1280%2C853",
    description: "Citroen C3 r5 1.6 turbo",
    price: 75000,
    quantity: 3
  });
  product.save();

  res.send("guardado");
});

//valida usuario
Router.post("/login", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var passEncriptada = encriptar(email, password);

  User.findOne({ email: email }, function(err, user) {
    if (user) {
      console.log("entro al servicio");
      //comprabamos si la contraseña encriptada es igual a la contraseña encriptada anteriormente
      if (user.password == passEncriptada && user.status == "Activo") {
        var response = {
          loginRes: "OK",
          email: user.email,
          avatar: user.urlAvatar,
          name: user.name
        };
        res.json(response);
      } else {
        var response = {
          loginRes: "contraseña incorrecta"
        };
        res.json(response);
      }
    } else {
      var response = {
        loginRes: "usuario no existe"
      };
      res.json(response);
    }
  });
});

//obtener datos usuario
Router.post("/user", function(req, res) {
  var username = req.body.usuario;
  User.findOne({ userId: username }, function(err, user) {
    if (user) {
      //enviamos data usuario
      console.log("usuario encontrado");
      res.json(user);
    } else console.log("usuario no existe");
  });
});
//Obtener todos los productos disponibles
Router.get("/all", function(req, res) {
  Product.find({ quantity: { $gte: 1 } }, function(err, product) {
    if (err) {
      res.status(500);
      res.json(err);
    }
    res.json(product);
  });
});

//Obtener todos los productos disponibles
Router.post("/search", function(req, res) {
  var name = req.body.name;
  Product.find(
    {
      quantity: { $gte: 1 },
      name: { $regex: ".*" + name.toUpperCase() + ".*" }
    },
    function(err, product) {
      if (err) {
        res.status(500);
        res.json(err);
      }
      res.json(product);
    }
  );
});

//realizar compras
Router.post("/shop", function (req, res) {
  var listaCompras = req.body;
  listaCompras.forEach(element => {
    Product.findOne({ name: element.name }, function (err, product) {
      if (err) {
        res.status(500);
        res.json(err);
      }
      var cantidad = product.quantity - element.quantity;
      product.quantity = cantidad;
      product.save();
    });
  });
  res.send("Actualizado");
});

module.exports = Router;
