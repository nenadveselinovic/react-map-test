import React from 'react'
import { GoogleApiWrapper } from 'google-maps-react';
import AutoComplete from './components/autocomplete'

// import logo from './logo.svg';
import './App.scss';

function App({google}) {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <AutoComplete google={google} />
    </div>
  );
}

const Loading = () => <div>Fancy loading container</div>;

// export default App;
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDuhesbZswaTWR_JHNmzZ28yFcF2lcPtsk',
  libraries: ['places', 'visualization'],
  LoadingContainer: Loading
})(App);
