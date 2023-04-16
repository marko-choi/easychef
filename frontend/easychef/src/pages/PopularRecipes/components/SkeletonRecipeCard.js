import React from 'react';
import { Skeleton, Checkbox } from '@mui/material';
import { Stack } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TimerIcon from '@mui/icons-material/Timer';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';

const SkeletonRecipeCard = () => {
  return ( <div className='popular-dish-card card mb-2'>
  <Stack>
    <Skeleton variant="rectangular" height={350} />
  </Stack>
  <Stack className="card-body pb-1 px-3 pt-1">
    <Skeleton className="mt-1" variant="rectangular" width={250} height={24} />
    <Skeleton className="mt-1 mb-2" variant="rectangular" width={160} height={18} />
    <div className="card-statistics p-0 col-12">
      <div className="row m-0 p-0">
        {/* Column 1 */}
        <div className="col-8 p-0">
          <div className="d-flex flex-row align-items-center">
          <ThumbUpIcon style={{ color: 'gray', marginRight: '3px', lineHeight: '0.8rem'}} />
          <Rating
            className="read-only-rating-buttons"
            style={{ padding: '0px', lineHeight: '1.1rem' }}
            readOnly
            emptyIcon={<StarIcon style={{color: 'lightgray'}} fontSize="inherit" />}
            value={0}
          />
          </div>
          <div className="d-flex flex-row align-items-center mt-1" style={{overflow: 'hidden'}}>
            <MenuBookIcon style={{ color: 'gray', marginRight: '3px'}} />
            <Skeleton className="mt-1" variant="rectangular" width={60} height={16} style={{ borderRadius: '20px' }} />
            <Skeleton className="mt-1 ms-1" variant="rectangular" width={66} height={16} style={{ borderRadius: '20px' }} />
          </div>
          <div className="d-flex flex-row align-items-center mt-1" style={{overflow: 'hidden'}}>
            <LocalDiningIcon style={{ color: 'gray', marginRight: '3px'}} />
            <Skeleton className="mt-1" variant="rectangular" width={60} height={16} style={{ borderRadius: '20px' }} />
            <Skeleton className="mt-1 ms-1" variant="rectangular" width={66} height={16} style={{ borderRadius: '20px' }} />
          </div>
        </div>
        {/* Column 2 */}
        <div className="col-4 p-0">
          <div className="d-flex flex-row align-items-center">
            <FavoriteIcon style={{ color: 'grey' }} />
            <Skeleton className="mt-1 ms-1" variant="rectangular" width={60} height={14} />
          </div>
          <div className="d-flex flex-row align-items-center mt-1">
            <TimerIcon style={{ color: 'grey' }} />
            <Skeleton className="mt-1 ms-1" variant="rectangular" width={60} height={14} />
          </div>
          <div className="d-flex flex-row align-items-center mt-1">
            <OutdoorGrillIcon style={{ color: 'grey' }} />
            <Skeleton className="mt-1 ms-1" variant="rectangular" width={60} height={14} />
          </div>
        </div>
      </div>
    </div>
  </Stack>
  <hr className="mt-2 mb-2 mx-2" />

  <div className="card-interactions row px-3 m-0 p-0 pb-1">
    <div className="m-0 p-0">
      <div className="d-flex justify-content-between">
        <div className="p-0 m-0 d-flex align-content-center">
          <span className="me-2 comment-lg">Rating</span>
          <Rating
            className="read-only-rating-buttons"
            style={{ padding: '0px', lineHeight: '1.1rem' }}
            readOnly
            value={0}
          />
        </div>
        <div>
        <Checkbox 
            className='recipe-like-checkbox'
            style={{ padding: '0px' }}
            icon={<FavoriteBorder />} 
            disabled
          />
        </div>
      </div>
    </div>
    
    {/* Comments */}
    { Array.from(new Array(2)).map((_, index) => (
      <div className="d-flex p-0" key={index}>
        <Skeleton className="mt-1" variant="rectangular" width={70} height={16} />
        <Skeleton className="ms-1 mt-1" variant="rectangular" width={220} height={16} />
      </div>
    ))}
  </div>

</div> );
}
 
export default SkeletonRecipeCard;