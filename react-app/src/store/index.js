import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import postReducer from './postReducer'
import commentReducer from './commentReducer'
import chatReducer from './chatReducer';
import likeReducer from './likeReducer';
import friendReducer from './friendReducer';
import imageReducer from './imageReducer';

const rootReducer = combineReducers({
  session,
   postState : postReducer,
   commentState : commentReducer,
   chatState : chatReducer,
   likeState : likeReducer,
   friendState : friendReducer,
   imageState : imageReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
