import React from 'react';
import { useState, useEffect } from 'react';
import { Radio, Autocomplete, Badge, Box, Checkbox, IconButton, Tooltip, TextField } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import SortIcon from '@mui/icons-material/Sort';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import '../style.css';
const FilterForm = ({
  handleIngredientChange,
  totalNumberOfRecipes,
  formData,
  handleFormChange,
  ingredientAutoList,
  getFilterAutoComplete,
  filtersList,
  handleChange,
  sort,
  getSortTooltip,
  sortAscend,
  sortClear,
  sortDescend,
  getFilteredPopularRecipes,
  formDataChanged,
  setFormDataChanged,
  resetFields,
}) => {
  return ( 
    <div className="sticky-top px-3 pt-3" 
      style={{
        overflowY: 'auto',
        height: '100vh',
        // borderTop: '5px solid #f3c792',
      }}>
      <div className="scrollable-filter"
        style={{
          backgroundColor: 'rgba(255, 229, 175, 0.4)',
          borderTop: '5px solid #f3c792',
        }}>
        <div className="px-3 pt-2 mt-2">
          <h2 className="text-uppercase mb-0 pb-0">Popular Dishes</h2>
          <p 
          className='text-muted m-0 p-0 pb-2'
          style={{
            fontSize: '0.85rem',
          }}>Showing {totalNumberOfRecipes || 0} recipes</p>
          <div className="inquiry-divider mb-1">&#8203;</div>
            <form>
              {/* <!-- Search --> */}
              <div className="search mb-3">
                <p className=" search-filter-label fs-6">Search</p>
                <hr />
                <Box>
                  <TextField
                    label="Recipe Name"
                    name="name"
                    className="search-input"
                    id="search-name"
                    size="small"
                    variant="standard"
                    onChange={handleFormChange}
                    value={formData.name}
                  />
                  <TextField
                    label="Creator"
                    name='author'
                    className="search-input"
                    id="search-creator"
                    size="small"
                    variant="standard"
                    onChange={handleFormChange}
                    value={formData.author}
                  />
                  <Autocomplete 
                    id="search-ingredients"
                    freeSolo
                    options={ingredientAutoList}
                    onInputChange={
                      (event, value) => {
                        getFilterAutoComplete(event, value, 'input');
                        handleIngredientChange(event, value);
                        // console.log('input', value)
                      }
                    }
                    getOptionLabel={(option) => option}
                    onChange={handleIngredientChange}
                    value={formData.ingredient}
                    renderInput={(params) => 
                      <TextField {...params} 
                        className="search-ingredients" 
                        label="Ingredients" 
                        variant="standard" 
                        fullWidth />}
                  />
                </Box>
                <div className="d-flex flex-row justify-content-end"> 
                  <Tooltip disableInteractive arrow title="Search" placement="bottom" enterDelay={100} leaveDelay={100}>
                    <IconButton aria-label="Search" className="submit-btn" style={{ backgroundColor: '#f3c792'}} size='small'
                      onClick={() => getFilteredPopularRecipes(10, 0)} >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip disableInteractive arrow title="Clear All Fields" placement="bottom" enterDelay={100} leaveDelay={100}>
                    <IconButton aria-label="Clear All Fields" className="submit-btn" style={{ backgroundColor: '#f3c792'}} size='small'
                      onClick={() => {
                        resetFields()
                      }
                      }>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </div>  

              </div>
              {/* <!-- Filter --> */}
              <div className="filter-divider mb-1">&#8203;</div>
              <div className="filter mb-3">
                <p className="search-filter-label fs-6">Filters</p>
                <hr />
                {/* <!-- Cuisines --> */}
                <div className="cuisine pb-2">
                  <p className="search-filter-label">Cuisine</p>
                  
                  {filtersList.cuisines.length === 0 && 
                    <Stack spacing={1}>
                      {[...Array(3)].map((_, index) => (
                        <div className="d-flex mt-1" key={index}>
                          <Skeleton className="me-3" variant="rectangular" width={22} height={22} />
                          <Skeleton variant="rectangular" width={170} height={22} />
                        </div>
                      ))}
                    </Stack>
                  }

                  {filtersList && filtersList.cuisines.map((cuisine, index) => (
                    <div className="d-flex" key={cuisine.value} 
                      style={{ 
                        alignItems: 'center', 
                        height: '1.4rem', 
                      }}>
                      <Checkbox 
                        id={cuisine.name}
                        checked={cuisine.checked}
                        onChange={(e) => {
                          const newFilters = [...filtersList.cuisines];
                          newFilters[index].checked = e.target.checked;
                          handleChange(newFilters, "cuisine");
                        }}
                        label={cuisine.name}
                        inputProps={{ 'aria-label': cuisine.name }} 
                        style={{ 
                          borderRadius: '0px', 
                          padding: '0px',  
                          margin: '0px', 
                        }}
                        size='small'
                      />
                      <Tooltip 
                        title={cuisine.name + ' (' + cuisine.amount + ' matches found)'}
                        placement="bottom"
                        arrow
                        disableInteractive 
                      >
                        <label 
                          className="checkbox-label text-muted fw-lighter"
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }} 
                          >
                          {`${cuisine.name} (${cuisine.amount})`}
                        </label>
                      </Tooltip>
                    </div>
                  ))}
                </div>
                
                {/* <!-- Diet --> */}
                <div className="diet pb-2">
                  <p className="search-filter-label">Diet</p>
                  
                  {filtersList.diets.length === 0 && 
                    <Stack spacing={1}>
                      {[...Array(3)].map((_, index) => (
                        <div className="d-flex mt-1" key={index}>
                          <Skeleton className="me-3" variant="rectangular" width={22} height={22} />
                          <Skeleton variant="rectangular" width={170} height={22} />
                        </div>
                      ))}
                    </Stack>
                  }

                  {filtersList && filtersList.diets.map((diet, index) => (
                    <div className="d-flex" key={diet.name} style={{ alignItems: 'center', height: '1.4rem'}}>
                      <Checkbox
                        className=""
                        id={diet.name}
                        checked={diet.checked}
                        onChange={(e) => {
                          const newFilters = [...filtersList.diets];
                          newFilters[index].checked = e.target.checked;
                          handleChange(newFilters, "diet");
                        }}
                        label={diet.name}
                        inputProps={{ 'aria-label': diet.name}}
                        style={{ borderRadius: '0px', padding: '0px',  margin: '0px'}}
                        size='small'
                      />
                      <Tooltip 
                        title={diet.name + ' (' + diet.amount + ' matches found)'}
                        placement="bottom"
                        arrow
                        disableInteractive 
                      >
                        <label
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap"
                          }}
                          className="checkbox-label text-muted fw-lighter"
                        >
                          {`${diet.name} (${diet.amount})`}
                        </label>
                      </Tooltip>
                    </div>
                  ))}
                </div>

                {/* <!-- Cooking Time --> */}
                <div className="cooking-time">
                  <p className="search-filter-label">Cooking Time</p>

                  {filtersList.cookingTime.length === 0 && 
                    <Stack spacing={1}>
                      {[...Array(3)].map((_, index) => (
                        <div className="d-flex mt-1" key={index}>
                          <Skeleton className="me-3" variant="rectangular" width={22} height={22} />
                          <Skeleton variant="rectangular" width={170} height={22} />
                        </div>
                      ))}
                    </Stack>
                  }
                  
                  {filtersList && filtersList.cookingTime.map((time, index) => (
                    <div className="d-flex" key={time.name} style={{ alignItems: 'center', height: '1.4rem'}}>
                      <Radio
                        className=""
                        id={time.name}
                        checked={time.checked}
                        name="cooking-time-radio-btns"
                        onClick={(e) => {
                          const newFilters = filtersList.cookingTime.map((time, i) => {
                            if (i === index) {
                              return {
                                ...time,
                                checked: time.checked ? false : true,
                              };
                            }
                            return {
                              ...time,
                              checked: false,
                            };
                          });
                          handleChange(newFilters, "cookingTime");
                          setFormDataChanged(true);
                        }}
                        label={time.name}
                        inputProps={{ 'aria-label': time.name}}
                        style={{ borderRadius: '0px', padding: '0px',  margin: '0px'}}
                        size='small'
                      />
                      <Tooltip
                        sx={{ height: '1.4rem' }} 
                        title={time.name + ' (' + time.amount + ' matches found)'}
                        placement="bottom"
                        arrow
                        disableInteractive 
                      >
                        <label
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap"
                          }}
                          className="checkbox-label text-muted fw-lighter"
                        >
                          {`${time.name} (${time.amount})`}
                        </label>
                      </Tooltip>
                    </div>
                  ))}

                </div>
              </div>
        
              {/* <!-- Sorting --> */}
              <div className="sorting-divider mb-1">&#8203;</div>
              <div className="sorting mb-3">
                <p className="search-filter-label">Sorting</p>
                <hr />
                {sort.map((sort, index) => {
                  // state 3 - descending sorting state
                  if (sort.active && sort.order === 'desc') {
                    return (
                      <div className="d-flex align-content-center justify-content-start" key={index} >
                          <Tooltip 
                            title={getSortTooltip(sort.name)}
                            placement="bottom"
                            arrow
                            disableInteractive
                            >
                            <IconButton style={{  padding: '2px' }}
                              onClick={() => sortClear(sort.name)}>
                              <Badge badgeContent={sort.priority} color="primary"
                                className="sorting-badge">
                                <SortIcon style={{ color: 'brown' }}></SortIcon>
                              </Badge>
                            </IconButton>
                          </Tooltip>
                        <span 
                          className="p-0 text-muted fw-light checkbox-label" 
                          style={{ 
                            marginLeft: '0.5rem',
                            textAlign: 'left',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                          }}> 
                            {sort.name}
                        </span>
                      </div>

                    )}
                    // state 1 - empty sorting state
                    else if (!sort.active) { 
                      return (
                        <div className="d-flex align-content-center justify-content-start" key={index} >
                          <Tooltip 
                            title={getSortTooltip(sort.name)}
                            placement="bottom"
                            arrow
                            disableInteractive
                            >
                            <IconButton style={{  padding: '2px' }}
                              onClick={() => sortAscend(sort.name)}>
                                <SortIcon transform="rotate(180)" />
                            </IconButton>
                          </Tooltip>
                          <span 
                            className="p-0 text-muted fw-light checkbox-label" 
                            style={{ 
                              marginLeft: '0.5rem',
                              textAlign: 'left',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                            }}> 
                              {sort.name}
                          </span>
                        </div>
                      )
                    }
                    // state 2 - ascending sorting state
                    else if (sort.active && sort.order === 'asc') {
                      return (
                          <div className="d-flex align-content-center justify-content-start" key={index} >
                          <Tooltip 
                            title={getSortTooltip(sort.name)}
                            placement="bottom"
                            arrow
                            disableInteractive
                            >
                            <IconButton style={{  padding: '2px' }}
                              onClick={() => sortDescend(sort.name)}>
                              <Badge badgeContent={sort.priority} color="primary"
                                className="sorting-badge">
                                <SortIcon
                                  transform="rotate(180)"
                                  style={{
                                    color: 'brown'
                                  }}></SortIcon>
                              </Badge>
                            </IconButton>
                          </Tooltip>
                        <span 
                          className="p-0 text-muted fw-light checkbox-label" 
                          style={{ 
                            marginLeft: '0.5rem',
                            textAlign: 'left',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                          }}> 
                            {sort.name}
                        </span>
                      </div>
                      )}
                    else {
                      return <></>;
                    }
                  })}
              </div>
            </form>
          </div>

        </div>
      {/* </div> */}
    </div>
   );
}
 
export default FilterForm;