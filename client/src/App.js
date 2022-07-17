import React, { Fragment} from 'react';
import './App.css';

//import components
import ListPatients from './components/ListPatients';
import InputPatients from './components/InputPatients';

function App() {
	return <Fragment>
		<div className='Container'>
			<InputPatients></InputPatients>
			<ListPatients></ListPatients>
		</div>
	</Fragment>
}


export default App;
