import React, { useState, useEffect } from 'react';
import { buildPath } from '../../../../path.js';
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
import { Dialog, IconButton, Avatar } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';



function EventHistory({eventHistory})
{
  const [orderBy, setOrderBy] = useState('checkOut');
  const [order, setOrder] = useState('desc');
  const [openViewModal, setOpenViewModal] = useState(false);
  const [eventDetails, setEventDetails] = useState([]);

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };

  function hourString(totalHours){
	const hourStr = totalHours.toString();

	// It is a whole hour
	if(!hourStr.includes('.')) return hourStr + ":00";

	const hours = hourStr.substring(0, hourStr.indexOf("."));

	const noHours = hours === "";

	// Less than 10 minutes
	const leadingZero = Number(hourStr.substring(hourStr.indexOf(".") + 1)) < 17;

	const minutes = Math.round((Number(hourStr.substring(hourStr.indexOf(".") + 1)) / 100) * 60);

	return ((noHours) ? "0" : "") + hours + ":" + ((leadingZero) ? "0" : "") + minutes;
 }


  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleViewClick = (singleEvent) => {
    setOpenViewModal(true);
    console.log(singleEvent);
    setEventDetails(singleEvent);
    
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
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    const newPageClamped = Math.min(Math.max(0, newPage), Math.ceil(eventHistory.length / rowsPerPage) - 1);
    setPage(newPageClamped);
  };
  

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString();
    return `${date} ${time}`;
  };

  useEffect(() => {
  }, [eventHistory]);


    return(
      <div>
        {eventHistory.length > 0 && (
        <Paper variant='outlined' className='tableContainer'>
          <TableContainer >
            <Table className="studentEventsTable">
               <TableHead>
                <TableRow>
                <TableCell style={{ width: '10%' }}>
                    
                  </TableCell>
                  <TableCell >
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      <strong>Name</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell >
                    <TableSortLabel
                      active={orderBy === 'checkIn'}
                      direction={orderBy === 'checkIn' ? order : 'asc'}
                      onClick={() => handleRequestSort('checkIn')}
                    >
                      <strong>Check In</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell >
                    <TableSortLabel
                      active={orderBy === 'checkOut'}
                      direction={orderBy === 'checkOut' ? order : 'asc'}
                      onClick={() => handleRequestSort('checkOut')}
                    >
                      <strong>Check Out</strong>
                    </TableSortLabel>
                  </TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(eventHistory, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(
                  (singleEvent) => (
                    <TableRow key = {singleEvent.ID}>
                      <TableCell><Button size='small' variant='contained' disableElevation sx={{backgroundColor: '#5f5395', '&:hover': {
                  backgroundColor: '#4f457c'}}} onClick={() => handleViewClick(singleEvent)}>View</Button></TableCell>
                      <TableCell>{singleEvent.name}</TableCell>
                      <TableCell>{formatDateTime(singleEvent.checkIn)}</TableCell>
                      <TableCell>{formatDateTime(singleEvent.checkOut)}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={eventHistory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        )}
                <Dialog
          open={openViewModal}
          onClose={handleCloseViewModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
            <IconButton
              aria-label="close"
              onClick={handleCloseViewModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                fontSize: 20,
              }}
            >
            <CancelIcon />
            </IconButton>
            <div className='modalContent' style={{ padding: '25px', maxWidth: '500px' }}>
              {eventDetails?.name && <h1 style={{ marginBottom: '10px', marginTop: '10px'}}>{eventDetails.name}</h1>}
              {eventDetails?.org && <p>Hosting Organization: {eventDetails.org}</p>}
              {eventDetails?.checkIn && <p>Check In: {formatDateTime(eventDetails.checkIn)}</p>}
              {eventDetails?.checkOut && <p>Check Out: {formatDateTime(eventDetails.checkOut)}</p>}
              {eventDetails?.startTime && <p>Start Time: {eventDetails.startTime}</p>}
              {eventDetails?.hours && <p>Hours: {hourString(eventDetails.hours)}<br/></p>}
            </div>
        </Dialog>
      </div>
    );
};

export default EventHistory;
