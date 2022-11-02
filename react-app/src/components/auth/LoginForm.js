import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import './loginform.css'
import SignUpFormModal from './Signupmodal'


const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div>
      <div className='leftdiv'>
      <div>logo goes here</div>
      
      <div className='desc'>Fakebook helps you build rapport with fellow human beings.</div>


      </div>
      <div className='rigth'>
    <form onSubmit={onLogin}>
      <div className='errors'>
        {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))}
      </div>
      <div className='email'>
        <label htmlFor='email'>Email</label>
        <input className='emailtab'
          name='email'
          type='text'
          placeholder='Email'
          value={email}
          onChange={updateEmail}
        />
      </div>
      <div className='password'>
        <label htmlFor='password'>Password</label>
        <input className='passwordtab'
          name='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={updatePassword}
        />
        <button className="login" type='submit'>Login</button>
        <button className="login" type='submit'>Demo user</button>
        <button className="signin" type='submit'><SignUpFormModal/></button>
      </div>
    </form>
    </div>
    </div>
  );
};

export default LoginForm;
