import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
// import NavBar from './components/NavBar/index';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import CreatePostForm from './components/posts/createpostform'
import UpdatePostForm from './components/posts/updatepostform'
import AllPosts from './components/homePagePost/homePagePosts';
import { UserSpotDetail } from './components/userPostdetails/userPostdetails';
import UpdateCommentForm from './components/comments/updateCommentform';
import CommentForm from './components/comments/createCommentForm';
import NavBar from './components/Navbar/index'





function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar loaded={loaded} />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>
        <ProtectedRoute path='/' exact={true} >
          <h1>My Home Page</h1>
          <AllPosts/>
        </ProtectedRoute>
        <ProtectedRoute path='/newpost' exact={true} >
          <h1>Create a post Page</h1>
          <CreatePostForm/>
        </ProtectedRoute>
        <ProtectedRoute path='/posts/:postId' exact={true} >
          <h1>Update a post Page</h1>
          <UpdatePostForm/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId/posts' exact={true} >
          <h1>User POst Page</h1>
          <UserSpotDetail/>
        </ProtectedRoute>
        <ProtectedRoute path='/comments/:commentId' exact={true} >
          <h1>update comment Page</h1>
          <UpdateCommentForm/>
        </ProtectedRoute>
        <ProtectedRoute path='/:postId/comments' exact={true} >
          <h1>create comment Page</h1>
          <CommentForm/>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
