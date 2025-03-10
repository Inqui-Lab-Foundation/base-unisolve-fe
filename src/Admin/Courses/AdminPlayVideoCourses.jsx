/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Card, CardBody, CardTitle } from 'reactstrap';
import './style.scss';
import { BsChevronRight } from 'react-icons/bs';
import { RiAwardFill } from 'react-icons/ri';
import { CommonDropDownComp } from '../../stories/CommonDropdown/CommonDropdownComp';
import { BsLayoutTextSidebarReverse } from 'react-icons/bs';
import { VscCheck } from 'react-icons/vsc';
import Vimeo from '@u-wave/react-vimeo';
import Layout from '../Layout';
import { BsQuestionCircle } from 'react-icons/bs';
import { Accordion, Modal } from 'react-bootstrap';
import { Button } from '../../stories/Button';
import { GrDocument } from 'react-icons/gr';
import { AiFillPlayCircle } from 'react-icons/ai';
// import { SearchDropdown } from "../../stories/DropdownWithSearch/DropdownWithSearch";

import DetaledQuiz from '../DetailedQuiz/DetaledQuiz';

import TakeAssesmentPopup from './TakeAssesmentPopup';
import ModuleAssesmentImg from '../../assets/media/moduleAssesmentPopup.svg';
import { VscCircleFilled } from 'react-icons/vsc';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { connect, useSelector } from 'react-redux';
import { getAdminCourseDetails } from '../../redux/actions';
import axios from 'axios';
import Csv from '../../assets/media/csv1.png';
import Pdf from '../../assets/media/pdf.png';
import { getCurrentUser } from '../../helpers/Utils';

const AdminPlayVideoCourses = (props) => {
    // console.log(props);
    const course_id = props.match.params.id;
    const description = props.location.data
        ? props.location.data.description
        : '';
    const title = props.location.data ? props.location.data.title : '';
    const courseModulesCount = props.location.data
        ? props.location.data.course_modules_count
        : '';
    const courseVideosCount = props.location.data
        ? props.location.data.course_videos_count
        : '';

    const currentUser = getCurrentUser('current_user');
    // console.log("============================currentUser=========", currentUser);
    const [condition, setCondition] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [showQuiz, setHideQuiz] = useState(false);
    const [quizId, setQizId] = useState('');
    const [worksheetId, setWorksheetId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [fileName, setFileName] = useState('');
    const [topicObj, setTopicObj] = useState({});
    const [id, setResponce] = useState([]);
    const [moduleResponce, setUpdateModuleResponce] = useState([]);
    const [worksheetResponce, SetWorksheetResponce] = useState([]);
    // const [videosList, setVideosList] = useState({
    //     videoTitle: '',
    //     videoLink: ''
    // });

    const [url, setUrl] = useState('');
    const [image, setImage] = useState();
    const [videoId, setVideoId] = useState('');
    const [setTopicArrays, setTopicArray] = useState([]);
    // const [modulesList, setModulesList] = useState({
    //     questionType: '',
    //     question: '',
    //     choice: ''
    // });
    const [videoIndex, setVideoIndex] = useState(0);
    const [volume, setVolume] = useState(1);
    const [paused, setPaused] = useState(false);
    const [item, setItem] = useState('');
    const [adminCourseDetails, setAdminCourseDetails] = useState('');
    const language = useSelector(state=>state?.admin?.adminLanguage);
    const scrollRef = React.createRef();


    useEffect(() => {
        props.getAdminCourseDetailsActions(course_id,language);
    }, [course_id,language]);

    useEffect(() => {
        var topicArrays = [];
        setAdminCourseDetails(
            props.adminCoursesDetails[0] &&
                props.adminCoursesDetails[0].course_modules
        );
        props.adminCoursesDetails[0] &&
            props.adminCoursesDetails[0].course_modules.map((course, index) => {
                course.course_topics.map((lecture, index) => {
                    topicArrays.push(lecture);
                });
            });
        setTopicArray(topicArrays);
    }, [props.adminCoursesDetails]);

    async function fetchData(videoId) {
        // console.log("00000000000000000000000000000000");
        setVideoId(videoId);
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/videos/' + videoId,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.data[0].token}`
            }
        };
        // let response = await axios(config);
        // console.log("res", response);
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setResponce(response.data && response.data.data[0]);
                    setCondition('Video1');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function getWorkSheetApi(worksheetId) {
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/worksheets/' +
                worksheetId,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.data[0].token}`
            }
        };
        axios(config)
            .then(function (response) {
                // console.log("===============responc", response);
                if (response.status === 200) {
                    SetWorksheetResponce(response.data.data[0]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleNxtVideo = (id) => {
        fetchData(id);
        setItem('VIDEO');
    };

    async function modulesListUpdateApi(courseTopicId) {
        // console.log(courseTopicId);
        const body1 = JSON.stringify({
            user_id: JSON.stringify(currentUser.data[0].user_id),
            course_topic_id: JSON.stringify(courseTopicId),
            status: 'Completed'
        });
        var config = {
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/userTopicProgress',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.data[0].token}`
            },
            data: body1
        };
        // let response = await axios(config);
        // console.log("res", response);
        await axios(config)
            .then(function (response) {
                if (response.status === 201) {
                    setUpdateModuleResponce(
                        response.data && response.data.data[0]
                    );
                    props.getAdminCourseDetailsActions(course_id,language);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const assmentList = [
        {
            icon: <VscCheck />,
            title: '1. Module Name',
            time: ' 7 mins',
            id: 115783408
        }
    ];

    const handlePlayerPause = () => {
        setPaused(true);
    };
    const handlePlayerPlay = () => {
        setPaused(false);
    };

    const progressProps = {
        options: [
            {
                name: 'Finish this course to get your certificate.',
                path: '/playCourse'
            }
        ],
        name: 'Your Progress',
        Icon: RiAwardFill,
        progress: true
    };

    const handleSeeked = () => {
        // console.log("428 event fired: ", event);
    };

    // const handleTimeUpdate = (event) => {
    //   // console.log("432event fired: ", event);
    //   if (event.seconds > "11.62") {
    //     // setModalShow(true);
    //   }
    // };

    const handleTimeUpdate = (event) => {
        // console.log("==========", event);
        const videoLength = event.duration; //500
        const halfTrimmedLength = videoLength / 2; //250
        const calculatePercentage = halfTrimmedLength / videoLength; //0.5
        const eventSeconds = Math.floor(event.seconds);
        const calculatedSeconds = Math.floor(halfTrimmedLength);

        // const lastTrimmedLength = videoLength / 1; //250
        // const calculatePercentage1 = lastTrimmedLength / videoLength; //0.5
        // const eventSeconds1 = Math.floor(event.seconds);
        // const calculatedSeconds1 = Math.floor(calculatePercentage1);

        // console.log(
        //   lastTrimmedLength,
        //   "lastTrimmedLength==",
        //   calculatePercentage1,
        //   "calculatePercentage12",
        //   eventSeconds1,
        //   "eventSeconds13",
        //   calculatedSeconds1,
        //   "calculatedSeconds14"
        // );

        if (
            event.percent === calculatePercentage &&
            eventSeconds === calculatedSeconds
        ) {
            handlePlayerPause();
            setModalShow(true);
        }

        // if (
        //   event.percent === calculatePercentage1 &&
        //   eventSeconds1 === calculatedSeconds1
        // ) {
        //   console.log("==============1===============");
        // }
        if (event.percent === 0.998) {
            // console.log("=========111111111111");s
            modulesListUpdateApi(topicObj.course_topic_id);
            handleSelect(
                topicObj.topic_type_id,
                topicObj.course_topic_id,
                topicObj.topic_type
            );
        }
        handlePlayerPlay();
    };

    const handleSelect = (topicId, couseId, type) => {
        scrollRef.current.scrollIntoView(); 
        setCourseId(couseId);
        const topic_Index =
            setTopicArrays &&
            setTopicArrays.findIndex(
                (data) =>
                    data.topic_type_id === topicId &&
                    data.course_topic_id === couseId
            );
        const topicObj = setTopicArrays[topic_Index + 1];
        setTopicObj(topicObj);

        if (type === 'WORKSHEET') {
            setWorksheetId(topicId);
            getWorkSheetApi(topicId);
            setItem('WORKSHEET');
            setHideQuiz(false);
        } else if (type === 'QUIZ') {
            setItem('QUIZ');
            setQizId(topicId);
        } else if (type === 'VIDEO') {
            setItem('VIDEO');
            // setVideoId(topicId);
            fetchData(topicId);
            setHideQuiz(false);
        } else {
            setItem('');
            setHideQuiz(false);
        }
    };

    // const video = assmentList[videoIndex];
    // console.log(
    //   "==============responceresponceresponceresponce",
    //   worksheetResponce
    // );

    // const handlePlayer = (time) => {
    //   if (time.getCurrentTime(3000)) {
    //     alert("jhani");
    //     console.log("jhani");
    //   }
    // };

    const videoStatus = (type, status) => {
        // console.log(type, "==========", status);
        const done = <IoCheckmarkDoneCircleSharp className="done" />;
        const notDone = <IoCheckmarkDoneCircleSharp />;
        if (type === 'VIDEO' && status === 'COMPLETED') {
            return done;
        } else if (type === 'VIDEO' && status === 'INCOMPLETE') {
            // console.log("=================================================");
            return notDone;
        }

        if (type === 'WORKSHEET' && status === 'COMPLETED') {
            return done;
        } else if (type === 'WORKSHEET' && status === 'INCOMPLETE') {
            return notDone;
        }

        if (type === 'QUIZ' && status === 'COMPLETED') {
            return done;
        } else if (type === 'QUIZ' && status === 'INCOMPLETE') {
            return notDone;
        }
    };

    const videoType = (type) => {
        if (type === 'VIDEO') {
            return <AiFillPlayCircle />;
        } else if (type === 'WORKSHEET') {
            return <GrDocument />;
        } else if (type === 'QUIZ') {
            return <BsQuestionCircle />;
        }

        // if (type === "doc" && status === true) {
        //   return done;
        // } else if (type === "doc" && status === false) {
        //   return notDone;
        // }

        // if (type === "quiz" && status === true) {
        //   return done;
        // } else if (type === "quiz" && status === false) {
        //   return notDone;
        // }
    };

    const handleClose = (item) => {
        // alert("item" + item);
        setItem('WORKSHEET');
        setModalShow(item);
        setHideQuiz(false);
    };
    const handleQuiz = () => {
        modulesListUpdateApi(topicObj.course_topic_id);
        handleSelect(
            topicObj.topic_type_id,
            topicObj.course_topic_id,
            topicObj.topic_type
        );
    };

    const handleAssesmentClose = (item) => {
        setItem('VIDEO');
        // const video_Id_Index =
        //   setArrays && setArrays.findIndex((data) => data === videoId);
        // const Video_id = setArrays[video_Id_Index + 1];
        // setVideoId(Video_id);
        setModalShow(item);
        setHideQuiz(false);
    };

    const changeHandler = (event) => {
        const file = event.target.files[0].name.split('.', 2);
        if (file[1] === 'csv' || file[1] === 'pdf') {
            let img = event.target.files[0];
            setUrl(file[1]);
            setImage(img);
            setFileName(event.target.files[0].name);
        }
    };
    const removeSelectedImage = () => {
        setImage();
        setFileName();
        setUrl();
    };

    const handleSubmit = () => {
        const data = new FormData();
        data.append('attachment_1', image);
        var config = {
            method: 'post',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/worksheets/' +
                worksheetId +
                '/response',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.data[0].token}`
            },
            data: data
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    modulesListUpdateApi(topicObj.course_topic_id);
                    handleSelect(
                        topicObj.topic_type_id,
                        topicObj.course_topic_id,
                        topicObj.topic_type
                    );
                    setImage();
                    setFileName();
                    setUrl();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleNextCourse = () => {
        modulesListUpdateApi(topicObj.course_topic_id);
        handleSelect(
            topicObj.topic_type_id,
            topicObj.course_topic_id,
            topicObj.topic_type
        );
    };
    // const OnLoaded = (e) => {
    //   console.log(e);
    // };
    // const video_stream_id = '666422934';
    // console.log(
    //   "===worksheetId",
    //   responce && responce.data[0] && responce.data[0].video_stream_id
    // );
    // console.log("===worksheetId", Math.floor(20 / 60));
    // const video_id = Number(id);

    // const id =
    //   worksheetId && worksheetId.data[0] && worksheetId.data[0].attachments;
    // const worksheerUrl =
    //   "http://15.207.254.154:3002" + worksheetId &&
    //   worksheetId.data[0] &&
    //   worksheetId.data[0].attachments;
    return (
        <Layout>
            <div className="courses-page" ref={scrollRef}>
                <Row className="courses-head view-head py-5">
                    <Col md={12} lg={9} className="mb-5 mb-md-5 mb-lg-0">
                        {/* <p className="course-breadcrum">
                            Courses <BsChevronRight /> Courses details
                        </p> */}
                        <div className="courses-type">
                            <BsLayoutTextSidebarReverse />
                            <span className="card-type">{title}</span>
                            <BsLayoutTextSidebarReverse className="lessonsvg" />
                            <span className="card-type">
                                {courseModulesCount} Modules
                            </span>
                            <RiAwardFill className="lessonsvg" />
                            <span className="card-type points">
                                {courseVideosCount} Videos
                            </span>
                        </div>
                    </Col>
                    <Col md={12} lg={3} className="my-auto text-right">
                        <div className="progress-dropdown">
                            <CommonDropDownComp {...progressProps} />
                        </div>
                    </Col>
                </Row>
                <div className="py-5 my-5 px-5 container-fluid">
                    <Row className="m-0 courser-video-section ">
                        <Col
                            xl={4}
                            className="course-assement order-2 order-xl-1"
                        >
                            <div className="assement-info">
                                <p className="content-title">Course content</p>
                                <div className="view-head"></div>
                                {/* <div className='courses-type pb-3'>
                  <BsDot />
                  <span className='card-type'>13 sections</span>
                  <BsDot className='lessonsvg' />
                  <span className='card-type'>76 lectures</span>
                  <BsDot className='lessonsvg' />
                  <span className='card-type points'>11h 9m total length</span>
                </div> */}
                                <div className="assement-item" id="scrollbar">
                                    <Accordion>
                                        {adminCourseDetails &&
                                            adminCourseDetails.length &&
                                            adminCourseDetails.map(
                                                (course, index) => {
                                                    // console.log("============return, course", course);
                                                    return (
                                                        <Accordion.Item
                                                            eventKey={index}
                                                            className="m-0 course-items"
                                                            key={index}
                                                        >
                                                            <Accordion.Header className="question">
                                                                <div className="course-sec">
                                                                    {/* <Avatar src={User} className="avatar-imgs" /> */}
                                                                    <div className="course-title">
                                                                        {
                                                                            course.title
                                                                        }
                                                                    </div>
                                                                    <div className="course-time">
                                                                        <span>
                                                                            {
                                                                                course.videos_count
                                                                            }{' '}
                                                                            Videos
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <div className="course-list">
                                                                    {course.course_topics.map(
                                                                        (
                                                                            lecture,
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <div
                                                                                    className={`course-sec-list ${
                                                                                        lecture.progress ===
                                                                                        'COMPLETED'
                                                                                            ? 'hHover'
                                                                                            : 'noHover'
                                                                                    }  `}
                                                                                    key={index}>
                                                                                    <Row
                                                                                        className={`justify-content-between w-100 px-4 py-3 ${
                                                                                            lecture.progress ===
                                                                                            'COMPLETED'
                                                                                                ? 'hHover'
                                                                                                : 'noCurser'
                                                                                        }`}
                                                                                    >
                                                                                       
                                                                                        <Col
                                                                                            md={
                                                                                                12
                                                                                            }
                                                                                            className="my-auto"
                                                                                            onClick={() =>
                                                                                                handleSelect(
                                                                                                    lecture.topic_type_id,
                                                                                                    lecture.course_topic_id,
                                                                                                    lecture.topic_type
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <p className="course-icon mb-0">
                                                                                                {videoStatus(
                                                                                                    lecture.topic_type,
                                                                                                    lecture.progress
                                                                                                )}

                                                                                                <span className="course-title">
                                                                                                    {
                                                                                                        lecture.title
                                                                                                    }
                                                                                                </span>

                                                                                                {lecture.type ===
                                                                                                'modal' ? (
                                                                                                        <span
                                                                                                            className="course-name"
                                                                                                            onClick={() =>
                                                                                                                setModalShow(
                                                                                                                    true
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                        Assesment
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        ''
                                                                                                    )}
                                                                                            </p>
                                                                                            <p className="course-time mb-0 px-5 my-auto">
                                                                                                {videoType(
                                                                                                    lecture.topic_type
                                                                                                )}
                                                                                                {/* <IoTimeOutline className='my-auto' /> */}
                                                                                                {lecture.video_duration && (
                                                                                                    <span className="px-2">
                                                                                                        {/* {lecture.video_duration} */}
                                                                                                        {Math.floor(
                                                                                                            lecture.video_duration /
                                                                                                                60
                                                                                                        )}
                                                                                                        min
                                                                                                    </span>
                                                                                                )}
                                                                                            </p>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    );
                                                }
                                            )}
                                    </Accordion>
                                </div>
                            </div>
                            
                        </Col>

                        <Col xl={8} className="course-video order-1 order-xl-2">
                            {item === 'QUIZ' && !showQuiz ? (
                                <div
                                    size="lg"
                                    centered
                                    className="modal-popup text-screen text-center  modal-popup"
                                >
                                    <div className="modal-content">
                                        <Modal.Header>
                                            <Modal.Title className="w-100 d-block mb-2">
                                                Ready for a quick test?
                                            </Modal.Title>
                                            <p className="w-100 d-block">
                                                Test your course skills in a
                                                short test challenge!
                                            </p>
                                            <div className="row justify-content-center text-center">
                                                <div className="col col-lg-3">
                                                    <p>
                                                        <VscCircleFilled
                                                            style={{
                                                                color: '#067DE1'
                                                            }}
                                                        />{' '}
                                                        5 Questions
                                                    </p>
                                                </div>
                                                <div className="col col-lg-3">
                                                    <p>
                                                        <VscCircleFilled
                                                            style={{
                                                                color: '#067DE1'
                                                            }}
                                                        />{' '}
                                                        10 - 15 Minutes
                                                    </p>
                                                </div>
                                            </div>
                                        </Modal.Header>

                                        <Modal.Body>
                                            <figure>
                                                <img
                                                    src={ModuleAssesmentImg}
                                                    alt="test"
                                                    className="img-fluid w-50"
                                                />
                                            </figure>
                                            <Button
                                                label="Let's Start"
                                                btnClass="primary mt-4"
                                                size="small"
                                                onClick={() =>
                                                    setHideQuiz(true)
                                                }
                                            />
                                        </Modal.Body>
                                    </div>
                                </div>
                            ) : item === 'WORKSHEET' ? (
                                <Fragment>
                                    <Card className="course-sec-basic p-5">
                                        <CardBody>
                                            <CardTitle
                                                className=" text-left pt-4 pb-4"
                                                tag="h2"
                                            >
                                                Unisolve Worksheet
                                            </CardTitle>
                                            <p>
                                                Description or Instructions
                                                details will display here...
                                            </p>
                                            <div className="text-right">
                                                {worksheetResponce.response !=
                                                null ? (
                                                        <a
                                                            href={
                                                                process.env
                                                                    .REACT_APP_API_IMAGE_BASE_URL +
                                                            '/images/default_worksheet.pdf'
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="primary"
                                                        >
                                                            {/* <p className='primary mt-4'>Download</p> */}

                                                            <Button
                                                                button="submit"
                                                                label="Download Worksheet"
                                                                btnClass="primary mt-4 mb-2"
                                                                size="small"
                                                                style={{
                                                                    marginRight:
                                                                    '2rem'
                                                                }}
                                                            />
                                                        </a>
                                                    ) : null}
                                                {worksheetResponce.response !=
                                                null ? (
                                                        <Button
                                                            label="Go to Next Course"
                                                            btnClass="primary w-auto"
                                                            size="small"
                                                            type="submit"
                                                            onClick={
                                                                handleNextCourse
                                                            }
                                                        />
                                                    ) : null}
                                            </div>

                                            {worksheetResponce.response ===
                                            null ? (
                                                    <Row className="my-5">
                                                        <Col md={3}>
                                                            <div className="wrapper">
                                                                <div className="btnimg">
                                                                upload
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    accept={
                                                                        '.pdf,.csv'
                                                                    }
                                                                    onChange={(e) =>
                                                                        changeHandler(
                                                                            e
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={9}>
                                                            <Row>
                                                                <Col
                                                                    md={6}
                                                                    className="my-auto"
                                                                >
                                                                    <p>
                                                                        {fileName}
                                                                    </p>
                                                                </Col>
                                                                <Col
                                                                    md={2}
                                                                    className="my-auto"
                                                                >
                                                                    {image &&
                                                                url ===
                                                                    'csv' ? (
                                                                            <img
                                                                                src={`${Csv}`}
                                                                                className="img-fluid"
                                                                                alt="Thumb"
                                                                            />
                                                                        ) : image &&
                                                                  url ===
                                                                      'pdf' ? (
                                                                                <img
                                                                                    src={`${Pdf}`}
                                                                                    className="img-fluid"
                                                                                    alt="Thumb"
                                                                                />
                                                                            ) : null}
                                                                </Col>
                                                                <Col
                                                                    md={2}
                                                                    className="my-auto"
                                                                >
                                                                    {image ? (
                                                                        <Button
                                                                            onClick={
                                                                                removeSelectedImage
                                                                            }
                                                                            btnClass="primary py-2 px-4"
                                                                            size="small"
                                                                            label="Remove"
                                                                        >
                                                                        Remove
                                                                        </Button>
                                                                    ) : null}
                                                                </Col>
                                                                <Col
                                                                    md={2}
                                                                    className="my-auto"
                                                                >
                                                                    {image ? (
                                                                        <Button
                                                                            btnClass="primary py-2 px-4"
                                                                            size="small"
                                                                            label="Submit"
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                handleSubmit(
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : null}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                ) : null}

                                            {/* <div class="wrapper">
                        <div class="btnimg">upload</div>
                        <input
                          type="file"
                          name="file"
                          accept=".pdf,.csv"
                          onChange={changeHandler}
                        />
                      </div>
                      {image ? (
                        <img src={`${url}`} style={styles.image} alt="Thumb" />
                      ) : null}

                      {image ? (
                        <button
                          onClick={removeSelectedImage}
                          style={styles.delete}
                        >
                          Remove
                        </button>
                      ) : null}
                      {image ? (
                        <Button
                          btnClass="primary px-5"
                          s
                          size="small"
                          label="Submit"
                          onClick={(e) => handleSubmit(e)}
                        />
                      ) : null} */}
                                        </CardBody>
                                    </Card>
                                </Fragment>
                            ) : item === 'VIDEO' && condition === 'Video1' ? (
                                <Card className="embed-container">
                                    <Vimeo
                                        video={id.video_stream_id}
                                        volume={volume}
                                        paused={paused}
                                        onPause={handlePlayerPause}
                                        onPlay={handlePlayerPlay}
                                        onSeeked={handleSeeked}
                                        onTimeUpdate={handleTimeUpdate}
                                    />
                                </Card>
                            ) : (
                                showQuiz === false && (
                                    <Fragment>
                                        <Card className="course-sec-basic p-5">
                                            <CardBody>
                                                <h6
                                                    style={{
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {description}
                                                </h6>
                                                {/* <CardTitle className=" text-left py-2" tag="h2">
                          {description}
                        </CardTitle> */}
                                                {/* <p> */}
                                                {/* Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book. It has
                          survived not only five centuries, but also the leap
                          into electronic typesetting, remaining essentially
                          unchanged. It was popularise
                        </p> */}
                                                {/* <CardTitle className=" text-left py-2" tag="h2">
                          Navigate in the User Guide
                        </CardTitle>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book. It has
                          survived not only five centuries, but also the leap
                          into electronic typesetting, remaining essentially
                          unchanged. It was popularise
                        </p> */}
                                            </CardBody>
                                        </Card>
                                    </Fragment>
                                )
                            )}

                            {showQuiz ? (
                                <DetaledQuiz
                                    course_id={course_id}
                                    quizId={quizId}
                                    handleQuiz={handleQuiz}
                                    handleClose={handleClose}
                                    handleNxtVideo={handleNxtVideo}
                                    quiz="true"
                                />
                            ) : (
                                ''
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
            <TakeAssesmentPopup
                quiz="true"
                refQst={id && id.reflective_quiz_questions}
                videoId={videoId}
                show={modalShow}
                handleClose={handleAssesmentClose}
                onHide={() => setModalShow(false)}
            />
        </Layout>
    );
};

// export default withRouter(AdminPlayVideoCourses);

const mapStateToProps = ({ adminCourses }) => {
    const { adminCoursesDetails, loading } = adminCourses;
    return { adminCoursesDetails, loading };
};
export default connect(mapStateToProps, {
    getAdminCourseDetailsActions: getAdminCourseDetails
})(AdminPlayVideoCourses);

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50
    },
    preview: {
        marginTop: 50,
        display: 'flex',
        flexDirection: 'column'
    },
    image: { maxWidth: '100', maxHeight: 150 },
    delete: {
        maxWidth: 70,
        maxHeight: 30,
        // cursor: "pointer",
        // padding: 15,
        background: 'white'
        // color: "white",
        // border: "none",
    }
};
