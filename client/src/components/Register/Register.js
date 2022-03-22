import React, { useState } from 'react';
import styles from './Register.module.css';
import axios from 'axios';

const Register = (props) => {
  const [data, setData] = useState({ firstName: "", lastName: "", pseudo: "", password: "", age: "", channels: [] });

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
    console.log(data)
  }

  const onClick = () => {
    axios.post(`http://localhost:3001/register`, { data })
      .then(res => {
        console.log(res)
        window.location.href = "/login";
      }).catch(
        err => console.log(err)
      )
  }

  return (
    <>
      <div class="container">
        <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <svg class="bi me-2" width="40" height="32"></svg>
            <span class="fs-4">IRC SNOOPY</span>
          </a>
          <ul class="nav nav-pills">
            <li class="nav-item"><a href="#" class="nav-link">Home</a></li>
            <li class="nav-item"><a href="#" class="nav-link">Register</a></li>
            <li class="nav-item"><a href="#" class="nav-link">Login</a></li>
          </ul>
        </header>
      </div>
      <div class="b-example-divider"></div>

      <div class="px-4 py-5 my-5 text-center">

        <h1 class="display-5 fw-bold">Glad to see you here. Register</h1>

        <div class="col-lg-6 mx-auto">

          <p class="lead mb-4">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins.</p>

          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">

            <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Messaging</button>

            <button type="button" class="btn btn-outline-secondary btn-lg px-4">Contact us</button>

          </div>

        </div>

      </div>

      <div className="container">
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
          <div className="form-group">
            <label>Pseudo</label>
            <input type="text" onChange={(e) => onChange(e)} name="pseudo" className="form-control" placeholder="Enter pseudo"></input>
          </div>
          <div className="form-group">
            <label>First name</label>
            <input type="text" onChange={(e) => onChange(e)} name="firstName" className="form-control" placeholder="Enter first name" />
          </div>
          <div className="form-group">
            <label>Last name</label>
            <input type="text" onChange={(e) => onChange(e)} name="lastName" className="form-control" placeholder="Enter last name" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" onChange={(e) => onChange(e)} name="password" className="form-control" placeholder="Enter password" />
          </div>
          <button type="submit" className="btn btn-outline-primary" onClick={() => onClick()}>Sign Up</button>
        </div>
      </div>

    </>
  )
};

Register.propTypes = {};

Register.defaultProps = {};

export default Register;
