import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';

function SearchBar(props) {
  // eslint-disable-next-line
  const { searchTerm, setSearchTerm, reverseSearchResults, searchAnnouncements } = props;
  //const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setSearchTerm('');
    // showAllUpdates();
  };
  
  // eslint-disable-next-line
  const showAllUpdates = () => {
    props.setFilterTerm('');
    props.fetchAllUpdates();
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;

    // if (searchTerm !== '' && newValue === '') {
    //   reverseSearchResults();
    // }

    setSearchTerm(newValue);
  };

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    console.log("searchTerm: "+searchTerm);
    setSearchTerm(searchTerm);
    var tempTerm = props.filterTerm;
    console.log(tempTerm);
    props.setFilterTerm(tempTerm);
    searchAnnouncements(searchTerm);
    if(searchTerm === '') {
      if(props.filterTerm === 'favorited') {
        console.log("surprise");
        console.log(props.finalFavUpdates);
        const allFavAnnouncements = props.finalFavUpdates.map(update => ({
          ...update,
          name: update.name,
        }));
        
        props.setSearchAnnouncement(allFavAnnouncements);
      } else {
        console.log("here---------");
      }
      
    }
  }
};


  useEffect(() => {
    console.log('Search term updated:', searchTerm);
	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div className="shortenSearch classes.root" variant="body1">
      <TextField
        placeholder="Search by Announcement Name"
        value={searchTerm}
        onChange={handleInputChange}
        sx={{ width: "127%", paddingTop: '3px' }}
        size='medium'
        onKeyPress={handleKeyPress}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ cursor: 'pointer' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <ClearIcon
                onClick={handleClear}
                onMouseDown={(e) => e.preventDefault()}
                style={{ cursor: 'pointer' }}
              />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export default SearchBar;
