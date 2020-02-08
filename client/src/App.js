import React from 'react';
import Routes from './Routes';
import Menu from './components/Menu';

function App(props) {
  return (
   <div>
      <Menu/>
      <div className='space'>
      <Routes/>
      </div>
   </div>
  );
}

export default App;
