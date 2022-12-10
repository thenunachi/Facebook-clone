

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import './loginform.css'
import SignUpFormModal from './Signupmodal'
import DemoUser from './demouser';


const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    if (email.length === 0) {
      return setErrors(["Email is required"])
    }
    if (password.length === 0) {
      return setErrors(["Password is required"])
    }
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(["Please provide valid credentials"]);
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
        {/* <div>logo goes here</div> */}

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
            <DemoUser />
            {/* <div className="signin">SignUp<SignUpFormModal showSignUpModal={showSignUpModal} setShowSignUpModal={setShowSignUpModal} /></div> */}
            <button className="signin" onClick={() => setShowSignUpModal(true)}>
              SignUp
            </button>
            <SignUpFormModal showSignUpModal={showSignUpModal} setShowSignUpModal={setShowSignUpModal} />
          </div>
        </form>
      </div>
      <footer>
        <div id="repos">

          <span className='link'><a href="https://github.com/thenunachi" target="_blank">Github</a></span>
          <span><a href="https://www.linkedin.com/in/thenammai-nachiyappan-56bbaa1a2/" target="_blank">linkedin</a></span>
        </div>
      </footer>
    </div>

  );
};

export default LoginForm;
