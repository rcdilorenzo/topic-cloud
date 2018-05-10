import React from 'react';
import { Route, Link } from 'react-router-dom';
import Home from '../home';

export default () => (
  <div>
    <header>
      <Link to="/">Home</Link>
    </header>

    <main>
      <Route exact path="/" component={Home} />
    </main>
  </div>
);
