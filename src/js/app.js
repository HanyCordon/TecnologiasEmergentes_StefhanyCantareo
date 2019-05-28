import React, { Component } from "react";
import { render } from "react-dom";
import Enumerable from "linq";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  Button,
  Icon,
  Navbar,
  NavItem,
  Badge,
  Card,
  CardTitle,
  Row,
  Col,
  Input,
  Collection,
  CollectionItem
} from "react-materialize";

//import "../css/style.css"; // Import CSS -> ADDED IN THIS STEP

class Home extends Component {
  constructor(props) {
    super(props);
    this.arrayProducts = [];
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      productosArray: []
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadItems = this.loadItems.bind(this);
    //this.resetComponents = this.resetComponents(this);
  }
  componentDidMount() {
    this.loadItems();
  }

  loadItems() {
    var resultado = [];
    fetch("http://localhost:8082/app/all")
      .then(res => res.json())
      .then(
        result => {
          resultado = result;
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
    return resultado;
  }
  busquedaDesdeComponente(data) {
    this.setState({
      isLoaded: true,
      items: data
    });
  }

  resetComponents(data) {
    this.setState({
      cantidad: 0,
      products: null,
      totalPagar: 0,
      items: null
    });
    this.arrayProducts = [];
    this.setState((this.state.items = null));

    var data = { name: " " };
    fetch("http://localhost:8082/app/search", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  addProducts(item) {
    var producto = Enumerable.from(this.arrayProducts)
      .where(x => x.name == item.name)
      .firstOrDefault();
    if (producto == null) {
      this.arrayProducts.push(item);
    } else {
      this.arrayProducts.forEach(product => {
        if (product.name === item.name) {
          product.quantity = item.quantity;
        }
      });
    }
    var totalItems = Enumerable.from(this.arrayProducts).sum(x => x.quantity);
    var totalPagar = Enumerable.from(this.arrayProducts).sum(
      x => x.quantity * x.price
    );
    console.log(this.arrayProducts.length);
    this.setState({
      cantidad: totalItems,
      products: this.arrayProducts,
      total: totalPagar
    });
  }
  render() {
    const visibleHome = {
      display: "none"
    };
    var items = <div />;
    if (this.state.items != null) {
      items = (
        <div>
          <Row>
            {this.state.items.map(item => (
              <Item
                item={item}
                quantity={item.quantity}
                addProducts={this.addProducts.bind(this)}
              />
            ))}
          </Row>
        </div>
      );
    }
    return (
      <div id="home" style={visibleHome}>
        <BarraNav cantidad={this.state.cantidad} />
        <div id="items">
          <Busqueda setParentState={this.busquedaDesdeComponente.bind(this)} />>
          {items}
        </div>
        <Summary
          products={this.state.products}
          total={this.state.total}
          reset={this.resetComponents.bind(this)}
        />
      </div>
    );
  }
}

class BarraNav extends Component {
  constructor(props) {
    super(props);
    this.handleClickCompras = this.handleClickCompras.bind(this);
    this.handleClickProductos = this.handleClickProductos.bind(this);
  }
  handleClickCompras() {
    if (this.props.cantidad > 0) {
      var items = document.getElementById("items");
      if (items != null) {
        items.style.display = "none";
      }
      var summary = document.getElementById("summary");
      if (summary != null) {
        summary.style.display = "inline";
      }
    }
  }
  handleClickProductos() {
    var items = document.getElementById("items");
    if (items != null) {
      items.style.display = "inline";
    }
    var summary = document.getElementById("summary");
    if (summary != null) {
      summary.style.display = "none";
    }
  }
  render() {
    let notificacion = "";
    if (this.props.cantidad > 0) {
      notificacion = <Badge newIcon>{this.props.cantidad}</Badge>;
    }
    return (
      <Navbar brand="La Bodega" right className="blue-grey darken-1">
        <NavItem href="#!" onClick={this.handleClickProductos}>
          Productos
        </NavItem>
        <NavItem href="#!" onClick={this.handleClickCompras}>
          Comprar {notificacion}
        </NavItem>
        <NavItem href="#!">LogOut</NavItem>
      </Navbar>
    );
  }
}

class Busqueda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  search(nombre) {
    var data = { name: nombre };
    fetch("http://localhost:8082/app/search", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result
          });
          this.props.setParentState(result);
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }
  handleChange(event) {
    this.search(event.target.value);
  }
  render() {
    return (
      <Row>
        <Col m={6} l={7} className="hide-on-small-only">
          <h4>Catálogo de Productos</h4>
        </Col>
        <Col s={12} m={6} l={5}>
          <Input
            label="Buscar"
            id="txtBusqueda"
            value={this.state.value}
            onChange={this.handleChange}
          >
            <Icon>search</Icon>
          </Input>
        </Col>
      </Row>
    );
  }
}

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "producto" };
    this.arrayQ = [];
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    var cantidad = 1;
    if (this.state.quantity != null) {
      cantidad = parseInt(this.state.quantity);
    }
    var producto = {
      name: this.props.item.name,
      quantity: cantidad,
      total: this.props.item.price * cantidad,
      imageUrl: this.props.item.urlImage,
      price: this.props.item.price
    };
    this.props.addProducts(producto);
  }
  handleChange(e) {
    var cantidad = e.target.value;
    this.setState({ quantity: e.target.value });
    console.log(cantidad);
  }
  componentWillMount() {
    for (var i = 1; i < this.props.item.quantity + 1; i++) {
      this.arrayQ.push(i);
    }
  }
  render() {
    return (
      <Col s={12} m={6} l={4}>
        <Card
          header={
            <CardTitle reveal image={this.props.item.urlImage} waves="light" />
          }
          title={this.props.item.name}
          reveal={<p>{this.props.item.description}</p>}
        >
          <div>
            <p>Cantidad Disponible: {this.props.quantity}</p>
            <p>Precio: {this.props.item.price}</p>
            <Row>
              <Input
                className="medium"
                s={12}
                type="select"
                label="Cantidad"
                defaultValue="1"
                value={this.state.quantity}
                onChange={this.handleChange}
              >
                {this.arrayQ.map(item => (
                  <option value={item}>{item}</option>
                ))}
              </Input>
              <Button
                waves="light"
                className="medium"
                onClick={this.handleClick}
              >
                Comprar
                <Icon left>add_shopping_cart</Icon>
              </Button>
            </Row>
          </div>
        </Card>
      </Col>
    );
  }
}

class Summary extends Component {
  constructor(props) {
    super(props);
    this.handleClickCancelar = this.handleClickCancelar.bind(this);
    this.handleClickShop = this.handleClickShop.bind(this);
  }
  handleClickCancelar() {
    this.props.reset(null);

    var items = document.getElementById("items");
    if (items != null) {
      items.style.display = "inline";
    }
    var summary = document.getElementById("summary");
    if (summary != null) {
      summary.style.display = "none";
    }
  }

  handleClickShop() {
    //realizar compra en servidor
    var data = this.props.products;
    fetch("http://localhost:8082/app/shop/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(
        result => {
          alert(result);
        },
        error => {
          this.setState({
            isLoaded: false,
            error
          });
        }
      );

    //regresar a productos

    this.props.reset(null);

    var items = document.getElementById("items");
    if (items != null) {
      items.style.display = "inline";
    }
    var summary = document.getElementById("summary");
    if (summary != null) {
      summary.style.display = "none";
    }
  }

  render() {
    const divStyle = {
      width: "10%",
      height: "10%"
    };
    const visible = {
      display: "none"
    };
    var collect = <div />;
    if (this.props.products != null) {
      collect = (
        <Collection>
          {this.props.products.map(item => (
            <CollectionItem className="">
              <img
                className="valign-wrapper responsive"
                src={item.imageUrl}
                style={divStyle}
              />
              {item.name}
              <Badge>Cantidad: {item.quantity}</Badge>
            </CollectionItem>
          ))}
        </Collection>
      );
    }

    return (
      <div id="summary" style={visible}>
        <Row>
          <h4>RESUMEN DE COMPRAS</h4>
          <Col s={12} m={6} l={6}>
            {collect}
          </Col>
          <Col s={12} m={6} l={6}>
            <Row>
              <p>Total: {this.props.total}</p>
            </Row>
            <Row>
              <Button
                waves="light"
                className="medium red"
                onClick={this.handleClickCancelar}
              >
                Cancelar
                <Icon left>cancel</Icon>
              </Button>
              <p />
              <Button
                waves="light"
                className="medium"
                onClick={this.handleClickShop}
              >
                Confirmar
                <Icon left>check_circle</Icon>
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
    this.loginHandleClick = this.loginHandleClick.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }
  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  loginHandleClick() {
    var data = {
      email: this.state.email,
      password: this.state.password
    };
    fetch("http://localhost:8082/app/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          if (result.loginRes == "OK") {
            var home = document.getElementById("home");
            if (home != null) {
              home.style.display = "inline";
            }
            var login = document.getElementById("login");
            if (login != null) {
              login.style.display = "none";
            }
          } else {
            alert(result.loginRes);
          }
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }
  render() {
    return (
      <div id="login">
        <Row className="grey darken-1">
          <Col s={0} m={6} l={6}>
            <h4>Tienda en linea React</h4>
          </Col>
          <Col s={0} m={6} l={6}>
            <Row>
              <Input
                type="email"
                label="Email"
                s={12}
                value={this.state.email}
                onChange={this.handleEmailChange}
              >
                <Icon>account_circle</Icon>
              </Input>
              <Input
                type="password"
                label="password"
                s={12}
                value={this.state.password}
                onChange={this.handlePasswordChange}
              >
                <Icon>vpn_key</Icon>
              </Input>
              <Button waves="light" onClick={this.loginHandleClick}>
                <Icon left>send</Icon>
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
class App extends Component {
  render() {
    return (
      <div>
        <Login />
        <Home />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));     
