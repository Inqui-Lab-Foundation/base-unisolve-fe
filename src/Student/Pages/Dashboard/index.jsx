import React, { useEffect, useLayoutEffect } from 'react';
import Layout from '../../Layout.jsx';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser, getNormalHeaders } from '../../../helpers/Utils.js';
import { KEY, URL } from '../../../constants/defaultValues.js';
import { getLanguage } from '../../../constants/languageOptions.js';
import { useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import AvatarImg from '../../../assets/media/img/Avatar.png';
import topCard1 from '../../../assets/media/img/admin-card-1.png';
import topCard2 from '../../../assets/media/img/admin-card-2.png';
import vector from '../../../assets/media/img/vector.png';
import vector1 from '../../../assets/media/img/Vector-1.png';
import vector2 from '../../../assets/media/img/Vector-2.png';
import vector3 from '../../../assets/media/img/Vector-3.png';
import './dashboard.scss';
import TopSectionCard from './sections/TopSectionCard.jsx';
import DashboardOverviewCard from './DashboardOverviewCard.jsx';
import { Table } from 'antd';
import { Progress } from 'reactstrap';
import Vimeo from '@u-wave/react-vimeo';
import { useDispatch } from 'react-redux';
import { FaCheckCircle,FaTimesCircle } from 'react-icons/fa';
import {
    getStudentByIdData,
    getStudentDashboardChallengesStatus,
    getStudentDashboardStatus,
    getStudentDashboardTeamProgressStatus,
    getStudentDashboardTutorialVideos
} from '../../../redux/studentRegistration/actions.js';
import LanguageSelectorComp from '../../../components/LanguageSelectorComp/index.js';

const Dashboard = () => {
    const language = useSelector(
        (state) => state?.studentRegistration?.studentLanguage
    );
    const currentUser = getCurrentUser('current_user');
    const dispatch = useDispatch();
    const {
        dashboardStatus,
        dashboardChallengesStatus,
        dashboardTeamProgressStatus,
        // dashboardTutorials,
        teamMember
    } = useSelector((state) => state?.studentRegistration);
    // const [videoId, setVideoId] = useState(null);
    const history = useHistory();
    useEffect(() => {
        dispatch(
            getStudentDashboardStatus(currentUser.data[0].user_id, language)
        );
        dispatch(
            getStudentDashboardChallengesStatus(
                currentUser.data[0].user_id,
                language
            )
        );
        dispatch(
            getStudentDashboardTeamProgressStatus(
                currentUser.data[0].user_id,
                language
            )
        );
    }, [dispatch, currentUser.data[0].user_id, language]);

    useEffect(() => {
        dispatch(getStudentDashboardTutorialVideos(language));
    }, [dispatch, language]);

    useEffect(() => {
        dispatch(getStudentByIdData(currentUser.data[0].student_id));
    }, [dispatch, currentUser.data[0].student_id]);

    const checkPresurvey = () => {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        axios
            .get(
                `${URL.getStudentPreSurveyList}?role=STUDENT&${getLanguage(
                    language
                )}`,
                axiosConfig
            )
            .then((preSurveyRes) => {
                if (preSurveyRes?.status == 200) {
                    console.log(preSurveyRes);
                    if (preSurveyRes.data.data[0].progress !== 'COMPLETED')
                        history.push('/student/pre-survey');
                }
            })
            .catch((err) => {
                return err.response;
            });
    };
    useLayoutEffect(() => {
        checkPresurvey();
    }, []);
    const cardData = {
        idea: {
            heading: 'Notice Board',
            deadline: `${
                dashboardChallengesStatus
                    ? dashboardChallengesStatus?.end_date
                    : '-'
            }`,
            subHeading: 'Idea  Submission',
            footerText: 'With Team Members',
            teamImages: [AvatarImg, AvatarImg, AvatarImg],
            rightImage: topCard1,
            position: 1
        },
        profile: {
            heading: 'User Profile',
            rightImage: topCard2,
            position: 2,
            footerLabels: {
                heading: 'Badges',
                value:
                    dashboardStatus && dashboardStatus?.badges_earned_count
                        ? dashboardStatus?.badges_earned_count
                        : 0
            }
        },
        teacher: {
            heading: 'Institute Details',
            rightImage: topCard2,
            position: 2,
            footerLabels: {
                heading: 'Team Count',
                value: 5
            }
        }
    };

    const percentageBWNumbers = (a, b) => {
        return (((a - b) / a) * 100).toFixed(2);
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'full_name',
            width: '20%',
            render: (_, record) =>
                record.full_name === currentUser?.data[0]?.full_name ? (
                    <div className="self-decor">{record.full_name}*</div>
                ) : (
                    record.full_name
                )
        },
        {
            title: 'Pre Survey',
            dataIndex: 'pre_survey_status',
            align:"center",
            width: '10%',
            render: (_, record) =>
                record?.pre_survey_status ? (
                    <FaCheckCircle size={20} color="green" />
                ) : (
                    <FaTimesCircle size={20} color="red" />
                )
        },
        {
            title: 'Lesson Progress',
            dataIndex: 'address',
            width: '30%',
            align:"center",
            render: (_, record) => {
                let percent =
                    100 -
                    percentageBWNumbers(
                        record.all_topics_count,
                        record.topics_completed_count
                    );
                return (
                    <div className='d-flex'>
                        <div style={{width:"80%"}}>
                            <Progress
                                key={'25'}
                                className="progress-height"
                                animated
                                color={
                                    percent
                                        ? percent <= 25
                                            ? 'danger'
                                            : percent > 25 && percent <= 50
                                                ? 'info'
                                                : percent > 50 && percent <= 75
                                                    ? 'warning'
                                                    : 'sucess'
                                        : 'danger'
                                }
                                value={percent}
                            />
                        </div>
                        <span className='ms-2'>{Math.round(percent) ? Math.round(percent) : '0'}%</span>
                    </div>
                );
            }
        },
        {
            title: 'Idea Submission',
            dataIndex: 'idea_submission',
            align:"center",
            width: '20%',
            render: (_, record) =>
                record?.idea_submission ? <FaCheckCircle size={20} color="green"/> : <FaTimesCircle size={20} color="red" />
        },
        {
            title: 'Post Survey',
            dataIndex: 'post_survey_status',
            align:"center",
            width: '10%',
            render: (_, record) =>
                record?.post_survey_status ? (
                    <FaCheckCircle size={20} color="green"/>
                ) : (
                    <FaTimesCircle size={20} color="red" />
                )
        },
        {
            title: 'Certificate',
            dataIndex: 'certificate_status',
            align:"center",
            width: '10%',
            render: (_, record) =>
                record?.certificate_status ? (
                    <FaCheckCircle size={20} color="green"/>
                ) : (
                    <FaTimesCircle size={20} color="red" />
                )
        }
    ];

    return (
        <Layout>
            <Container className="dashboard-wrapper">
                <div className='d-flex justify-content-between align-items-center'>
                    <h2>Dashboard</h2>
                    <div className='bg-white rounded p-3 d-flex align-items-center' style={{width:"max-content"}}>
                        <p>Preferred Language : </p>
                        <LanguageSelectorComp module="student" />
                    </div>
                </div>
                <hr />
                <Row className="d-flex flex-start mb-5" style={{ gap: '1rem' }}>
                    <TopSectionCard
                        heading={cardData.idea.heading}
                        deadline={cardData.idea.deadline}
                        subHeading={cardData.idea.subHeading}
                        footerText={cardData.idea.footerText}
                        // teamImages={cardData.idea.teamImages}
                        rightImage={cardData.idea.rightImage}
                        position={cardData.idea.position}
                    />
                    <TopSectionCard
                        heading={cardData.profile.heading}
                        footerLabels={cardData.profile.footerLabels}
                        rightImage={cardData.profile.rightImage}
                        position={cardData.profile.position}
                        name={
                            currentUser && currentUser?.data[0]?.full_name
                                ? currentUser?.data[0]?.full_name
                                : '-'
                        }
                        email={
                            currentUser && currentUser?.data[0]?.team_name
                                ? currentUser?.data[0]?.team_name
                                : '-'
                        }
                        mentorData={
                            teamMember && teamMember?.team?.mentor
                                ? teamMember?.team?.mentor
                                : null
                        }
                    />
                    <TopSectionCard
                        heading={cardData.teacher.heading}
                        footerLabels={cardData.teacher.footerLabels}
                        rightImage={cardData.teacher.rightImage}
                        position={cardData.teacher.position}
                        type="teacher"
                        organiZation={
                            teamMember && teamMember?.team?.mentor
                                ? teamMember?.team?.mentor?.organization
                                : null
                        }
                    />
                </Row>
                <Row className="flex-start mb-5" style={{ gap: '1rem' }}>
                    <DashboardOverviewCard
                        title={'Completed Videos'}
                        count={
                            dashboardStatus &&
                            dashboardStatus?.videos_completed_count
                                ? dashboardStatus?.videos_completed_count
                                : 0
                        }
                        image={vector2}
                    />
                    <DashboardOverviewCard
                        title={'Completed Quiz'}
                        count={
                            dashboardStatus &&
                            dashboardStatus?.quiz_completed_count
                                ? dashboardStatus?.quiz_completed_count
                                : 0
                        }
                        image={vector1}
                    />

                    <DashboardOverviewCard
                        title={'Completed Worksheets'}
                        count={
                            dashboardStatus &&
                            dashboardStatus?.worksheet_completed_count
                                ? dashboardStatus?.worksheet_completed_count
                                : 0
                        }
                        image={vector3}
                    />
                    <DashboardOverviewCard
                        title={'Overall Progress'}
                        count={
                            Math.round(
                                100 -
                                    percentageBWNumbers(
                                        dashboardStatus?.all_topics_count,
                                        dashboardStatus?.topics_completed_count
                                    )
                            ) + ' %'
                        }
                        image={vector}
                    />
                </Row>
                <Row
                    className="course-team flex-start mb-5"
                    style={{ gap: '1rem' }}
                >
                    <Col md={12} className="flex-2 team-progress">
                        <h2>Team Progress</h2>
                        <div className="bg-white team-progress rounded  p-3">
                            <div className="row flex-column p-2">
                                <label
                                    htmlFor="teams"
                                    className="mb-3 text-capitalize"
                                >
                                    <span>{currentUser.data[0].team_name}</span>
                                </label>
                            </div>
                            <Table
                                bordered
                                pagination={false}
                                dataSource={dashboardTeamProgressStatus}
                                columns={columns}
                            />
                        </div>
                    </Col>
                    <Col md={12} className="flex-1">
                        <p style={{ fontSize: '1.5rem' }}>
                            Introduction to SIDP by Mr. C. Shunmugaraj, EDII-TN
                        </p>
                        <div className="bg-white learning-statistics rounded p-3">
                            <div className="flex-2 px-3 d-flex justify-content-center align-items-center">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative'
                                    }}
                                >
                                    {<Vimeo video={770500069} volume={true} />}
                                </div>
                            </div>
                        </div>
                        {/* <div className="bg-white learning-statistics rounded p-3">
                            <div className="flex-2 px-3">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative'
                                    }}
                                >
                                    {
                                        <Vimeo
                                            video={770500069}
                                            volume={true}
                                            autoplay
                                            showTitle
                                        />
                                    }
                                </div>
                            </div>
                            <div className="flex-1 seperator-left px-3">
                                <ol className="list-unstyled">
                                    {dashboardTutorials &&
                                        dashboardTutorials.length > 0 &&
                                        dashboardTutorials.map((item, i) => (
                                            <li
                                                key={i}
                                                onClick={() => {
                                                    setVideoId(
                                                        item.video_stream_id
                                                    );
                                                }}
                                                style={{backgroundColor:`${videoId === item.video_stream_id && "lightgray"}`,padding:"2rem"}}
                                                className="mb-4 pointer"
                                            >
                                                {item.title}
                                            </li>
                                        ))}
                                </ol>
                            </div>
                        </div> */}
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default Dashboard;
