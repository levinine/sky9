import React from 'react';
import Routes from './Routes';
import Menu from './components/Menu'

function App() {
  return (
   <div>
      <Menu/>
      <div class="space" >
      <Routes/>
      </div>
   </div>

  );
}

export default App;