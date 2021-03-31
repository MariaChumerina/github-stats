import React, { createContext, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { initialState, reducer } from './store/reducer';
import { Login } from './components/Login';
import { Home } from './components/Home/Home';
import { AuthContextType } from './types/appTypes';
import { Header } from './components/Header/Header';
import { Repository } from './components/Repository';
import { withRouter } from 'react-router';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AuthContext = createContext<AuthContextType>({ state: initialState, dispatch: () => {} });

export const App: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AuthContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            <Header />
            <Router>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route exact path="/" component={withRouter(Home)} />
                    <Route exact path="/repository/:name" component={withRouter(Repository)} />
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
};
