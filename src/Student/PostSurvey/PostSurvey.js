import React, { useEffect, useState } from 'react';
import '../../Teachers/PostSurvey/style.scss';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap';
import { Button } from '../../stories/Button';
import { useFormik } from 'formik';
// import * as Yup from 'yup';
import Layout from '../Layout';
import { URL, KEY } from '../../constants/defaultValues';
import {
    getCurrentUser,
    getNormalHeaders,
    openNotificationWithIcon
} from '../../helpers/Utils';
import axios from 'axios';
import Congo from '../../assets/media/survey-success.jpg';
import { getLanguage } from '../../constants/languageOptions';
import { useDispatch, useSelector } from 'react-redux';
import { UncontrolledAlert } from 'reactstrap';
import CommonPage from '../../components/CommonPage';
import { useTranslation } from 'react-i18next';
import { getStudentChallengeSubmittedResponse } from '../../redux/studentRegistration/actions';

const PostSurvey = () => {
    const { t } = useTranslation();
    const { ideaSubmissionStatus } = useSelector(
        (state) => state?.studentRegistration
    );
    const currentUser = getCurrentUser('current_user');
    const dispatch = useDispatch();
    const [postSurveyList, setPostSurveyList] = useState([]);
    const [quizSurveyId, setQuizSurveyId] = useState(0);
    const [count, setCount] = useState(0);
    const [postSurveyStatus, setPostSurveyStatus] = useState('COMPLETED');
    const language = useSelector(state => state?.studentRegistration?.studentLanguage);
    const showPage = ideaSubmissionStatus && ideaSubmissionStatus !== "DRAFT";
    const formik = useFormik({
        initialValues: {},
        onSubmit: async (values) => {
            const axiosConfig = getNormalHeaders(KEY.User_API_Key);
            let responsesData = Object.keys(values).map((eachValues) => {
                let selected = values[eachValues].split(' -- ');
                return {
                    quiz_survey_question_id: selected[0],
                    selected_option: selected[1]
                };
            });

            let submitData = {
                responses: responsesData
            };
            if (postSurveyList.length != submitData.responses.length) {
                openNotificationWithIcon(
                    'warning',
                    'Please Attempt All Questions..!!',
                    ''
                );
            } else {
                return await axios
                    .post(
                        `${URL.getPostSurveyList}/${quizSurveyId}/responses?${getLanguage(language)}`,
                        JSON.stringify(submitData, null, 2),
                        axiosConfig
                    )
                    .then((preSurveyRes) => {
                        if (preSurveyRes?.status == 200) {
                            openNotificationWithIcon(
                                'success',
                                'PostSurvey is been submitted successfully..!!',
                                ''
                            );
                            setCount(count + 1);

                            formik.resetForm();
                        }
                    })
                    .catch((err) => {
                        return err.response;
                    });
            }
        }
    });
    useEffect(() => {
        dispatch(
            getStudentChallengeSubmittedResponse(
                currentUser?.data[0]?.team_id,
                language
            )
        );
    }, [language, dispatch, currentUser?.data[0]?.team_id]);
    
    useEffect(() => {
        let axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const lang = getLanguage(language);
        const final = lang.split('=');
        axiosConfig['params'] = {
            role: "STUDENT",
            local: final[1]
        };
        axios
            .get(`${URL.getStudentPostSurveyList}`, axiosConfig)
            .then((postSurveyRes) => {
                if (postSurveyRes?.status == 200) {

                    setQuizSurveyId(
                        postSurveyRes.data.data[0].quiz_survey_id
                    );
                    setPostSurveyStatus(
                        postSurveyRes.data.data[0].progress
                    );
                    let allQuestions = postSurveyRes.data.data[0];
                    setPostSurveyList(allQuestions.quiz_survey_questions);
                }
            })
            .catch((err) => {
                return err.response;
            });
    }, [language, count]);
    const comingSoonText = t('dummytext.student_post_survey');
    return (
        <Layout>
            {!showPage ? 
                <CommonPage text={comingSoonText} /> :
                <Container className="presuervey mb-50 mt-5 ">
                    <Col>
                        <Row className=" justify-content-center">
                            <div className="aside  p-4 bg-transparent">
                                {postSurveyStatus != 'COMPLETED' &&
                                    <UncontrolledAlert color="danger" className='mb-5'>
                                        Please complete the following post survey to get course completion certificate.
                                    </UncontrolledAlert>}
                                <h2>Post Survey</h2>
                                <CardBody>
                                    {postSurveyStatus != 'COMPLETED' && (
                                        <Form
                                            className="form-row"
                                            onSubmit={formik.handleSubmit}
                                            isSubmitting
                                        >
                                            {postSurveyList.map(
                                                (eachQuestion, i) => (
                                                    <Row key={i}>
                                                        <Card className="card mb-4 my-3 comment-card px-0 px-5 py-3">
                                                            <div className="question quiz">
                                                                <b>
                                                                    {i + 1}.{' '}
                                                                    {
                                                                        eachQuestion.question
                                                                    }
                                                                </b>
                                                            </div>
                                                            <div className="answers">
                                                                <FormGroup
                                                                    tag="fieldset"
                                                                    className="w-100"
                                                                    id="radioGroup1"
                                                                    label="One of these please"
                                                                    value={
                                                                        formik.values
                                                                            .radioGroup1
                                                                    }
                                                                    error={
                                                                        formik.errors
                                                                            .radioGroup1
                                                                    }
                                                                    touched={
                                                                        formik.touched
                                                                            .radioGroup1
                                                                    }
                                                                    onChange={
                                                                        formik.handleChange
                                                                    }
                                                                    onBlur={
                                                                        formik.handleBlur
                                                                    }
                                                                >
                                                                    <FormGroup
                                                                        check
                                                                    >
                                                                        <Label check>
                                                                            <Input
                                                                                type="radio"
                                                                                name={`radioGroup${i}`}
                                                                                id="radioOption1"
                                                                                value={`${eachQuestion.quiz_survey_question_id} -- ${eachQuestion.option_a}`}
                                                                            />{' '}
                                                                            {
                                                                                eachQuestion.option_a
                                                                            }
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup
                                                                        check
                                                                    >
                                                                        <Label check>
                                                                            <Input
                                                                                type="radio"
                                                                                name={`radioGroup${i}`}
                                                                                id="radioOption2"
                                                                                value={`${eachQuestion.quiz_survey_question_id} -- ${eachQuestion.option_b}`}
                                                                            />{' '}
                                                                            {
                                                                                eachQuestion.option_b
                                                                            }
                                                                        </Label>
                                                                    </FormGroup>
                                                                    <FormGroup
                                                                        check
                                                                    >
                                                                        <Label check>
                                                                            <Input
                                                                                type="radio"
                                                                                name={`radioGroup${i}`}
                                                                                id="radioOption3"
                                                                                value={`${eachQuestion.quiz_survey_question_id} -- ${eachQuestion.option_c}`}
                                                                            />{' '}
                                                                            {
                                                                                eachQuestion.option_c
                                                                            }
                                                                        </Label>
                                                                    </FormGroup>

                                                                    <FormGroup
                                                                        check
                                                                    >
                                                                        <Label check>
                                                                            <Input
                                                                                type="radio"
                                                                                name={`radioGroup${i}`}
                                                                                id="radioOption4"
                                                                                value={`${eachQuestion.quiz_survey_question_id} -- ${eachQuestion.option_d}`}
                                                                            />{' '}
                                                                            {
                                                                                eachQuestion.option_d
                                                                            }
                                                                        </Label>
                                                                    </FormGroup>


                                                                </FormGroup>
                                                            </div>
                                                        </Card>
                                                    </Row>
                                                )
                                            )}

                                            <div className="text-right">
                                                <Button
                                                    type="submit"
                                                    btnClass={
                                                        !(
                                                            formik.dirty &&
                                                            formik.isValid
                                                        )
                                                            ? 'default'
                                                            : 'primary'
                                                    }
                                                    disabled={
                                                        !(
                                                            formik.dirty &&
                                                            formik.isValid
                                                        )
                                                    }
                                                    size="small"
                                                    label="Submit"

                                                />
                                            </div>
                                        </Form>
                                    )}

                                    {postSurveyStatus == 'COMPLETED' && (
                                        <div style={{ textAlign: 'center' }}>
                                            <div>
                                                <img className="img-fluid w-25" src={Congo}></img>
                                            </div>
                                            <div>
                                                <h2>
                                                    Post Survey has been
                                                    submitted
                                                </h2>
                                            </div>
                                        </div>
                                    )}
                                </CardBody>
                            </div>
                        </Row>
                    </Col>
                </Container>}
        </Layout>
    );
};

export default PostSurvey;
