import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import "./style.scss";
import { BsChevronRight, BsFilter } from "react-icons/bs";
import { FaMedal } from "react-icons/fa";
import { DropDownComp } from "../../stories/DropdownComp/DropdownComp";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { BsFillPauseFill } from "react-icons/bs";
import { FiPlayCircle } from "react-icons/fi";
import { VscCheck } from "react-icons/vsc";
import CourseVideo from "../../assets/img/courseVideo.png"
import { Avatar, Icon } from "antd";
import Vimeo from "@u-wave/react-vimeo";

//VIMEO REFERENCE
//https://github.com/u-wave/react-vimeo/blob/default/test/util/createVimeo.js

const PlayVideoCourses = (props) => {
//   const videos = [
//     { id: 115783408, name: "Jambinai - Connection" },
//     { id: 162959050, name: "Jambinai - They Keep Silence" },
//     { id: 169408731, name: "Hoody - Like You" },
//   ];

  const assmentList = [
    {
      icon: <VscCheck />,
      title: "1. Module Name",
      time: " 6 mins",
      id: 115783408,
    },
    {
      icon: <BsFillPauseFill />,
      title: "2. Module Name",
      time: " 6 mins",
      id: 162959050,
    },
    {
      icon: "",
      title: "3. Module Name",
      time: " 6 mins",
      id: 169408731,
    },
    {
      icon: "",
      title: "4. Module Name",
      time: " 6 mins",
      id: 169408731,
    },
    {
      icon: "",
      title: "5. Module Name",
      time: " 6 mins",
      id: 169408731,
    },
    {
      icon: "",
      title: "6. Module Name",
      time: " 6 mins",
      id: 169408731,
    },
    {
      icon: "",
      title: "7. Module Name",
      time: " 6 mins",
      id: 169408731,
    },
  ];
  const [videoIndex, setVideoIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [paused, setPaused] = useState(false);
  const handlePause = (event) => {
    setPaused(event.target.checked);
  };

  const handlePlayerPause = (event) => {
    setPaused(true);
  };
  const handlePlayerPlay = (event) => {
    setPaused(false);
  };

  const handleVolume = (event) => {
    setVolume(parseFloat(false));
  };

  const selectVideo = (index) => {
    setVideoIndex(index);
  };

  const SearchProps = {
    size: "small",
    placeholder: "Search Course",
  };
  const progressProps = {
    label: "Your Progress",
    icon: <FiPlayCircle />,
  };
  const filterDropProps = {
    label: "Filter by",
    labelIcon: BsFilter,
  };
  const ImageCardProps = {
    label: "ImageCardComp",
    imgUrl: "https://picsum.photos/318/180",
    title: "How can I improve self care with Ikigai?",
    count: "1,288 students",
    time: "5m",
    type: "Health",
  };

  const video = assmentList[videoIndex];
  return (
    <div className="courses-page">
      <Row className="m-0">
        <Col className="p-0">
          <div className="courses-head view-head">
            <div>
              <p className="course-breadcrum">
                Courses <BsChevronRight /> Courses details
              </p>
              <h2 className="header-title">Courses by Unisolve</h2>
              <div className="courses-type">
                <BsLayoutTextSidebarReverse />
                <span className="card-type">Health</span>
                <BsLayoutTextSidebarReverse className="lessonsvg" />
                <span className="card-type">6 lessons</span>
                <FaMedal className="lessonsvg" />
                <span className="card-type points">
                  300 possible mastry points
                </span>
              </div>
            </div>
            <div className="progress-dropdown">
              <DropDownComp {...progressProps} />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="m-0 courser-video-section ">
        <Col className="course-assement">
          {/* <h5>
            Video
          </h5>
          <div className="collection">
            {videos.map((choice, index) => (
              <a
                href={`#!/video/${index}`}
                className={`collection-item ${video === choice ? 'active' : ''}`}
                onClick={() => selectVideo(index)}
              >
                {choice.name}
              </a>
            ))}
          </div> */}
          {/* <h5>
            Paused
          </h5>
          <p>
            <label htmlFor="paused">
              <input
                type="checkbox"
                id="paused"
                checked={paused}
                onChange={handlePause}
              />
              <span>Paused</span>
            </label>
          </p>
          <h5>
            Volume
          </h5> */}
          {/* <input
            type="range"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolume}
          /> */}
          <div className="assement-info">
            <p className="content-title">Course content</p>
            <div className="assement-item">
              <ul>
                {assmentList.map((choice, index) => {
                  return (
                    <li>
                      <div className="d-flex assmentList">
                        <div className="video-status-icon">{choice.icon}</div>
                        <div>
                          <a
                            href={`#!/video/${index}`}
                            className={`moduleName collection-item ${
                              video === choice ? "active" : ""
                            }`}
                            onClick={() => selectVideo(index)}
                          >
                            {choice.title}
                          </a>
                          {/* <p className="moduleName"> {choice.title}</p> */}
                          <p className="videoTime">
                            <FiPlayCircle /> {choice.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="module-assement">
            <div className="assement-info">
              <p className="content-title">Module Assessement</p>
              <p className="module-text m-0">
                Test your knowledge of all skills in this module
              </p>
              <p className="assement-link">
                Take assessment <BsChevronRight />
                <img src={CourseVideo} />
              </p>
              
            </div>
          </div>
        </Col>

        <Col xs={8} className="course-video">
          <div>
            <Vimeo
              video={video.id}
              width={700}
              
              volume={volume}
              paused={paused}
              onPause={handlePlayerPause}
              onPlay={handlePlayerPlay}
            />
            {/* <Vimeo video="674904051" autoplay width={700} height={400} /> */}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(PlayVideoCourses);
