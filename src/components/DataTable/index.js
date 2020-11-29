import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
  root: {
    margin: '0 auto'
  },
});

export default function DataTable({ dataBySearchText }) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [page, setPage] = useState(0);
  const [thumbnail, setThumbnail] = useState([]);
  const [loader, setLoader] = useState(true);
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchBeerCraftData =  async() => {
      const response = await fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/beercraft5bac38c.json');
      const results = await response.json();
      const ThumbResponse = await fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/beerimages7e0480d.json');
      const ThumbResults = await ThumbResponse.json();
      setData(results);
      setThumbnail(ThumbResults);
      setLoader(false);
      console.log(results);
    };

    fetchBeerCraftData();
  }, []);

  useEffect(() => {
    if(dataBySearchText && dataBySearchText.trim() !== '') {
      const filterDatabyText = data.filter((item) => item.name.toLowerCase().includes(dataBySearchText.toLowerCase()));
      console.log('byText', filterDatabyText);
      setFilterData(filterDatabyText);
    }
  }, [dataBySearchText]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const renderTable = () => {
    const tableData = (filterData && dataBySearchText && dataBySearchText.trim() !== '') ? filterData : data;
    const renderData = tableData.filter((item, index) => index >= page * rowsPerPage && index <= page * rowsPerPage + rowsPerPage - 1);
    return renderData.map((row, index) => (
      <TableRow key={row.id}>
        <TableCell component="th" scope="row">
          {thumbnail[index % 5] && <Avatar alt="Remy Sharp" src={thumbnail[index % 5].image} />}
        </TableCell>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{row.abv ? row.abv : 'NA'}</TableCell>
        <TableCell align="left">{row.ounces}</TableCell>
        <TableCell align="left">{row.style}</TableCell>
      </TableRow>
    ))
  }

  return (
    <>
    {!loader ? <Grid className={classes.root} container item lg={8} justify="center" direction="column">
      <TableContainer component={Paper}>
        <Table aria-label="BeerCreft Table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">ABV</TableCell>
              <TableCell align="left">Ounces</TableCell>
              <TableCell align="left">Style</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTable()}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[]}
        count={filterData.length ? filterData.length : data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
      />
    </Grid>: <LinearProgress />}
    </>
  );
}
