import React from "react";
import "../recipe-details.css";
import { Tooltip, Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";

const Comment = ({ comment }) => {

    let date = comment.time;
    date = date.split("T")[0];


    return (
    <div>
        <div className="col">
            <div className="d-flex user-info p-2 pb-0">
                <img
                className="rounded-circle profilepic"
                src={"http://localhost:8000" + comment.avatar}
                alt=""
                />
                <div className="d-flex flex-column ps-2">
                <p className="mb-0 mt-2">{comment.username}</p>
                <p>
                    Posted on:{" "}
                    <time dateTime={date}>{date}</time>
                </p>
                </div>
            </div>
            <div className="mt-2">
                <p className="text-body-secondary" style={{marginLeft: "0.em"}}>
                {comment.comment}
                </p>
            </div>
            {comment.images.length !== 0 &&
                <Carousel
                interval={null}
                className="mx-0 my-3"
                height={300}
                fullHeightHover={false}
                navButtonsProps={{
                    style: {
                    backgroundColor: "white",
                    size: "smaller",
                    padding: "0px",
                    color: "grey",
                    },
                }}
                indicatorContainerProps={{
                    style: {
                      zIndex: 1,
                      marginTop: "-30px",
                      position: "relative",
                      size: "smaller"
                    }
                  }}
                  indicatorIconButtonProps={{
                    style: {
                        padding: '10px',    // 1
                        color: '#D3D3D3'       // 3
                    }
                  }}  
                  activeIndicatorIconButtonProps={{
                    style: {
                        color: '#EEE',
                        padding: '0px',
                    }
                }}
                >
                {comment.images.map(
                    (image, index) => (
                    <Paper
                        key={index}
                        className="d-flex justify-content-center align-items-center p-0 m-0"
                        style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        background: "#FEFEFE",
                        }}
                    >
                        <img
                        key={image}
                        src={"http://localhost:8000" + image}
                        alt={image}
                        style={{
                            width: "50%",
                        }}
                        />
                    </Paper>
                    )
                )}
                </Carousel>}
        </div>
        <hr />
    </div>
    
    );
};

export default Comment;