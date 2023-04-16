import React from "react";
import "../recipe-details.css";
import { useState, useEffect } from "react";
import axios from "axios";

const CommentUpload = ({ recipeId, statesetComments }) => {

    const [profileInformation, setProfileInformation] = useState({name: '', phone: '', avatar: ''});
    const [comments, setComments] = useState('');
    const [commentImages, setcommentImages] = useState([]);

    const updateImages = (newImages) => {
        setcommentImages(newImages);
      };
    
    const getUserProfile = async () => {
        await axios.get('http://localhost:8000/auth/viewprofile/')
          .then((res) => {
            let info = {
              ...res.data,
              name: res.data.first_name + ' ' + res.data.last_name,
              phone: res.data.phone_number
            }
            if (info.avatar) {
              info.avatar = 'http://localhost:8000' + info.avatar;
            }
            setProfileInformation(info);
          });
    }

    useEffect(() => {
        getUserProfile();
    }, [])

    function postComment(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('recipe_id', recipeId);
        commentImages.forEach((image) => {
            formData.append('images', image);
        });
        formData.append('comment',comments);
        axios({
            method: 'post',
            url: 'http://localhost:8000/social/recipe-comment/',
            data: formData,
            headers: {'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          async function fetch_data(recipe_id) {
            await axios.get(`http://localhost:8000/recipe/recipe-detail/${recipe_id}/`)
              .then((res) => {
                statesetComments(res.data.comments);
              });
          }
          fetch_data(recipeId);
          setComments('');
          setcommentImages([]);
          document.getElementById('media').value = '';
        });
    }
          
    return (
        <div className="comments p-5 mt-3 mb-5 rounded-4">
            {/* <!-- Comment Upload Section --> */}
            <div className="col">
                <h2>Leave a comment</h2>
                <form className="form-group mb-4">
                    <label htmlFor="Name">Name</label>
                    <input
                    type="text"
                    className="form-control"
                    id="Name"
                    placeholder="e.g. Astryx"
                    value={profileInformation.name}
                    disabled
                    />
                    <label htmlFor="Comment">Comment</label>
                    <textarea
                    className="form-control"
                    id="Comment"
                    rows="3"
                    placeholder="e.g. This recipe is amazing!"
                    value={comments}
                    onChange={(e) => {setComments(e.target.value)}}
                    required
                    ></textarea>
                    <label htmlFor="media">Upload Media</label>
                    <br />
                    <input
                    type="file"
                    className="form-control rounded-0 .btn-sm"
                    id="media"
                    multiple
                    onChange={(event) => {
                        const imageArray = [];
                        [...event.target.files].forEach((file) => {
                          imageArray.push(file);
                        });
                        updateImages(imageArray);
                      }}
                    />
                    <button
                    type="submit"
                    className="align-text-top btn btn-warning mt-1"
                    onClick={postComment}
                    >
                    Post Comment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CommentUpload;