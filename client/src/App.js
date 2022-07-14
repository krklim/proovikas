import React, { Fragment } from 'react';
import './App.css';

//import components
import InputPatients from './components/InputPatients';
import ListPatients from './components/ListPatients';

function App() {
  return <Fragment>
	<div className='Container'>
		<InputPatients></InputPatients>
		<ListPatients></ListPatients>
	</div>
  </Fragment>
}

export default App;
