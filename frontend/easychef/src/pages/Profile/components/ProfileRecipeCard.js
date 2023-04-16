import React, { useState} from 'react';
import { IconButton, Card, Chip,
  Table, TableBody, TableCell, TableRow, Tooltip, Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import SuccessAlert from '../../../components/SuccessAlert';
import { useNavigate } from 'react-router-dom';

const ProfileRecipeCard = ({ recipe, userRecipes, setUserRecipes }) => {
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    navigate(`/edit-my-recipe/${recipe.recipe_id}/`);
  };

  const handleDelete = async () => {
    userRecipes.map((rc, index) => {
      if (rc.recipe_id === recipe.recipe_id) {
        userRecipes.splice(index, 1);
        setUserRecipes([...userRecipes]);
      }
      return rc;
    })

    await axios.delete(`http://localhost:8000/recipe/recipe-edit/${recipe.recipe_id}/`)
    .then((res) => {
      
      // TODO: this aint working
      setIsDelete(!isDelete);
      setShowDeleteDialog(!showDeleteDialog);
      setTimeout(() => {
        setShowDeleteDialog(false);
        console.log(isDelete, showDeleteDialog)
      }, 3000);
    }).catch((err) => {
      console.log(err);
    });
    
  }

  return ( 
    <div>
      { showDeleteDialog && <SuccessAlert message="Recipe deleted successfully"/>}
      <Card 
        className='p-3 my-1'
        elevation={0}
        style={{ background: '#FCFCFCBB' }}>
        <div className="d-flex align-items-center">
          <div
          width={150}
          height={130}
          style={{
            // overflow: 'hidden',
          }}
          >

            {recipe.images.length > 0 ?
                recipe.images[0].slice(-3) === "mp4" ? (
                  <video
                  controls
                  src={"http://localhost:8000" + recipe.images[0]}
                  alt={recipe.images[0]}
                  width={120}
                  height={120}
                  style={{
                      backgroundColor: "transparent",
                      width: "100%",
                      
                  }}
                  />
              ) : (
              <img 
                src={"http://localhost:8000" + recipe.images[0]} 
                width={166.89}
                height={120}
                style={{
                  objectFit: 'cover',
                }}
                />
              ) :
              <div style={{ 
                width: '166.89px',
                height: '120px',
                background: '#F3C992',
              }}>
                <div className="d-flex justify-content-center align-items-center h-100">
                  No Image&nbsp;
                </div>
              </div> 
            }
          </div>
          <div className="px-3 m-0 w-100">
            <div className="d-flex">
              <Link to={`/recipe-detail/${recipe.recipe_id}`}
                style={{ color: 'orange' }}>
                <h2>{recipe.recipe_name}</h2>
              </Link>
            </div>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: '145px' }}>
                    Preparation Time
                  </TableCell>
                  <TableCell style={{ width: '100px' }}>
                    <span className="fw-light" style={{ color: '#888'}}>
                      {recipe.prep_time + ' min(s)' || '-'}
                    </span>
                  </TableCell>
                  <TableCell style={{ width: '135px' }}>Total Likes</TableCell>
                  <TableCell style={{ width: '10px' }}>
                    <span className="fw-light" style={{ color: '#888'}}>
                      {recipe.likes || '0'}
                    </span>
                  </TableCell>
                  <TableCell className="p-0" style={{ width: '5px'}}>Cuisine</TableCell>
                  <TableCell style={{ maxWidth: '100px'}}>
                    {
                      recipe.cuisines.length === 0 &&
                      <span className="fw-light" style={{ color: '#888'}}>
                        No cuisine(s)
                      </span>
                    }
                    {recipe.cuisines.slice(0,3).map((cuisine, index) => (
                      <Chip
                        key={index}
                        style={{ background: "#F3C992", marginTop: '1px', marginBottom: '1px', marginLeft: '1px' }}
                        label={cuisine[1]} size='small' />
                    ))}
                    {
                      recipe.cuisines.length > 2 &&
                      <span>&nbsp;...</span>
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cooking Time</TableCell>
                  <TableCell>
                    <span className="fw-light" style={{ color: '#888'}}>
                      {recipe.cooking_time + ' min(s)' || '0'}
                    </span>
                  </TableCell>
                  <TableCell>Average Ratings</TableCell>
                  <TableCell>
                    <span className="fw-light" style={{ color: '#888'}}>
                      {recipe.ratings || '0'}
                    </span>
                  </TableCell>
                  <TableCell className="p-0">Diet</TableCell>
                  <TableCell style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {
                      recipe.diets.length === 0 &&
                      <span className="fw-light" style={{ color: '#888'}}>
                        No diet(s)
                      </span>

                    }
                    {recipe.diets.slice(0,3).map((diet, index) => (
                      <Chip
                        key={index}
                        style={{ background: "#F3C992", marginTop: '1px', marginBottom: '1px', marginLeft: '1px' }}
                        label={diet[1]} size='small' />  
                    ))}
                    { recipe.diets.length > 2 &&
                      <span>&nbsp;...</span>}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          { !isDelete ? 
            <div>
              <div className="my-2">
                <IconButton onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
              </div>
              <div className="my-2">
                <IconButton onClick={() => setIsDelete(true)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
            : 
            <div>
              <div className="my-2">
                <Tooltip title={
                  <Typography variant="subtitle1" style={{ fontFamily: "Roboto" }}>
                    Delete Recipe
                  </Typography>
                } placement="right">
                  <IconButton onClick={() => handleDelete()} 
                    style={{background: '#4CAF50'}}
                  >
                    <DoneIcon style={{color: 'white'}}/>
                  </IconButton>
                </Tooltip>
              </div>
              <div className="my-2">
                <Tooltip title={
                    <Typography variant="subtitle1" style={{ fontFamily: "Roboto" }}>
                      Cancel
                    </Typography>
                  } placement="right">
                  <IconButton onClick={() => setIsDelete(false)}
                    style={{ background: '#da6844'}}>
                    <CloseIcon style={{color: 'white'}} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          }
        </div>
      </Card>
    </div>
   );
}
 
export default ProfileRecipeCard;