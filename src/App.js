import React, {useState} from 'react';
import './App.css';
import Header from './components/Header';
import DataTable from './components/DataTable';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    margin: '20px auto'
  },
});

function App() {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const onChange = (event) => {
    setSearchText(event.target.value);
  }
  return (
    <div className="App">
      <Header searchChange={onChange}/>
      <div className={classes.root}>
        <DataTable dataBySearchText={searchText}/>
      </div>
    </div>
  );
}

export default App;
