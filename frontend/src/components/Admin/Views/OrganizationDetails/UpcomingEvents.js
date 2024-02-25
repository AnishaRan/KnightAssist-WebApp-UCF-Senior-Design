import React, { useState, useEffect } from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import '../../AdminHome.css';

function UpcomingEvents({ events }) {

    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
  
    const handleRequestSort = (property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleViewClick = (organizationID) => {
      console.log("clicked");
      
    };
  
    const stableSort = (array, comparator) => {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    };
  
    const getComparator = (order, orderBy) => {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    };
  
    const descendingComparator = (a, b, orderBy) => {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    };
  
  
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(6);
  
    const handleChangePage = (event, newPage) => {
      const newPageClamped = Math.min(Math.max(0, newPage), Math.ceil(events.length / rowsPerPage) - 1);
      setPage(newPageClamped);
    };
    
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };



  return (
    <div>
            <Paper variant='outlined' className='tableContainer'>
      <TableContainer >
        <Table className="orgTable">
          <TableHead>
            <TableRow>
            <TableCell>
                
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  <strong>Name</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'startTime'}
                  direction={orderBy === 'startTime' ? order : 'asc'}
                  onClick={() => handleRequestSort('startTime')}
                >
                  <strong>Start Time</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'endTime'}
                  direction={orderBy === 'endTime' ? order : 'asc'}
                  onClick={() => handleRequestSort('endTime')}
                >
                  <strong>End Time</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'maxAttendees'}
                  direction={orderBy === 'maxAttendees' ? order : 'asc'}
                  onClick={() => handleRequestSort('maxAttendees')}
                >
                  <strong>Max Attendees</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'checkedInStudents'}
                  direction={orderBy === 'checkedInStudents' ? order : 'asc'}
                  onClick={() => handleRequestSort('checkedInStudents')}
                >
                  <strong>Checked In</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'registeredVolunteers'}
                  direction={
                    orderBy === 'registeredVolunteers' ? order : 'asc'
                  }
                  onClick={() => handleRequestSort('registeredVolunteers')}
                >
                  <strong>Registered Volunteers</strong>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(events, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(
              (event) => (
                <TableRow key={event._id}>
                  <TableCell><Button size='small' variant='contained' disableElevation sx={{backgroundColor: '#5f5395', '&:hover': {
                  backgroundColor: '#4f457c'}}} onClick={() => handleViewClick(event._id)}>View</Button></TableCell>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.startTime}</TableCell>
                  <TableCell>{event.endTime}</TableCell>
                  <TableCell>{event.maxAttendees}</TableCell>
                  <TableCell>{event.checkedInStudents.length}</TableCell>
                  <TableCell>{event.registeredVolunteers.length}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[6, 10, 20]}
        component="div"
        count={events.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </div>
  );
}

export default UpcomingEvents;
