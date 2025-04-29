import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { useNavigate, Link } from 'react-router-dom';
import './../../styles/Login.css';
import LOGO from '../../img/ONMPRI.png'
import { FaInfo } from "react-icons/fa";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (store.user?.isAuthenticated) {
      const redirectPath = store.user.role === 'admin' ? '/admin-dashboard' : '/home';
      navigate(redirectPath, { replace: true });
    }
  }, [store.user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setError('');

    try {
      const response = await actions.login({ email, password });

      if (response?.token) {
        //   if (setToken) setToken(response.token);

        // Redirigir basado en el rol del usuario
        const redirectPath = store.user.role === 'admin' ? '/admin-dashboard' : '/home';
        console.log('Redirigiendo a:', redirectPath);
        // Dos métodos de redirección para asegurar el funcionamiento
        navigate(redirectPath);
        // navigate(redirectPath, { replace: true });
        // window.location.href = redirectPath;
      } else {
        setError('Credenciales incorrectas o error en el servidor');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setError(error.message || 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  return (

    <div className='containerRMC'>
      <div className='containerH'>



        <div className="main">
          <div className="mainInner">


            <div className="login">
              <div className="heading" style={{ color: "white", marginTop: "20px" }}>Escudo</div>
              <form className="form" onSubmit={handleSubmit}>
                <input
                  placeholder="Correo electrónico"
                  id="email"
                  name="email"
                  type="email"
                  className="inputlog"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  placeholder="Contraseña"
                  id="password"
                  name="password"
                  type="password"
                  className="inputlog"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="loginNew" style={{ marginTop: "-20px" }}>
                  <button value="Iniciar sesión" type="submit" >Ingresar</button>
                  <span >
                    <Link className='forgot-password' to="/forgot-password">Olvidé mi contraseña</Link>
                  </span>
                  <span >
                    <Link className='forgot-password' style={{ fontSize: 'x-large' }} to="/signup">Regístrate</Link>
                  </span>

                </div>
              </form>
            </div>
          </div>
          <div className="register">
            <form className="form">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={LOGO} className='logo' />
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;