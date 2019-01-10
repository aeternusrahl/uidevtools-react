import * as React from 'react';
import './app.scss';
import Home from './pages/home/home';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { asyncComponent } from 'react-async-component';

const AsyncEpochTime = asyncComponent({
  resolve: () => import('./pages/epochTime/epochTime')
});

const AsyncJson = asyncComponent({
  resolve: () => import('./pages/json/json')
});

const AsyncBase64 = asyncComponent({
  resolve: () => import('./pages/base64/base64')
});

const AsyncURI = asyncComponent({
  resolve: () => import('./pages/uri/uri')
});

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <>
        <header className='site-header'><h1>DEVELOPER TOOLS</h1></header>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/epoch-time' component={AsyncEpochTime}/>
            <Route path='/json' component={AsyncJson}/>
            <Route path='/base64' component={AsyncBase64}/>
            <Route path='/uri' component={AsyncURI}/>
            <Redirect to='/'/>
          </Switch>
        </BrowserRouter>
      </>

    );
  }
}

export default App;
