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
import '../AdminHome.css';
import { useNavigate } from 'react-router';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { buildPath } from '../../../path.js';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CancelIcon from '@mui/icons-material/Cancel';

function OrgTable(props) {
  const navigate = useNavigate();

  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [open, setOpen] = React.useState(false);
  const [selectedOrgID, setSelectedOrgID] = React.useState(null);
  const [message, setMessage] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpen = (organizationID) => {
    setSelectedOrgID(organizationID);
    setOpen(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleViewClick = (organizationID) => {
    console.log(`Clicked organization View for ID: ${organizationID}`);
    navigate(`/adminhome/organizations/${organizationID}`);
  };

  const handleDeleteClick = (organizationID) => {
    console.log(`Clicked organization View for ID: ${organizationID}`);
    handleClickOpen(organizationID);
  };

  async function handleDeleteOrg() {
    let orgID = selectedOrgID;

    const json = 
    {
      id: orgID,
    }
    let url = buildPath(`api/organizationDelete`);
    let response = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(json),
      headers: {"Content-Type": "application/json"},
    });

    let res = await response.text();

    console.log(res);
    handleClose();

    if (response.ok) {
      props.getAllOrgs();
      setMessage("Organization deleted successfully")
      setIsSuccessful(true);
    } else {
      setMessage("Error occurred")
      setIsSuccessful(false); 
    }

    setOpenAlert(true);

  }

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
    const newPageClamped = Math.min(Math.max(0, newPage), Math.ceil(props.orgs.length / rowsPerPage) - 1);
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
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  <strong>Email</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  <strong>Created</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'favorites'}
                  direction={orderBy === 'favorites' ? order : 'asc'}
                  onClick={() => handleRequestSort('favorites')}
                >
                  <strong>Followers</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'events'}
                  direction={
                    orderBy === 'events' ? order : 'asc'
                  }
                  onClick={() => handleRequestSort('events')}
                >
                  <strong>Events</strong>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(props.orgs, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(
              (org) => (
                <TableRow key={org._id}>
                  <TableCell>
                    <Button size='small' variant='contained' disableElevation sx={{backgroundColor: '#5f5395', '&:hover': {backgroundColor: '#4f457c'}}} onClick={() => handleViewClick(org._id)}>View</Button>
                    <Button size='small' variant='contained' disableElevation sx={{marginLeft: '5px', backgroundColor: '#E71F51', '&:hover': {backgroundColor: '#CA214B'}}} onClick={() => handleDeleteClick(org._id)}>Delete</Button>
                  </TableCell>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.email}</TableCell>
                  <TableCell>{org.createdAt}</TableCell>
                  <TableCell>{org.favorites?.length ?? 0}</TableCell>
                  <TableCell>{org.events?.length ?? 0}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[6, 10, 20]}
        component="div"
        count={props.orgs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Account!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteOrg} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {message.length !== 0 && (
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
              {message.includes("Error") ? (
                <Alert severity="error" onClose={handleCloseAlert}>
                  {message}
                </Alert>
              ) : (
                <Alert severity="success" onClose={handleCloseAlert}>
                  {message}
                </Alert>
              )}
            </Snackbar>
        )}
    </div>
    
  );
}

export default OrgTable;
