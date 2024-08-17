const BaseUrl= `http://localhost:5000/api`;

module.exports = {
    SIGNUP_URL: `${BaseUrl}/user/signup`,
    LOGIN_URL: `${BaseUrl}/user/login`,
    GET_MEMBERS: `${BaseUrl}/space/get_members`,
    CREATE_SPACE: `${BaseUrl}/space/create`,
    GET_SPACE: `${BaseUrl}/space/`,
    CREATE_TASK: `${BaseUrl}/task/create`,
    SPACE_GET_ALL_TASK: `${BaseUrl}/task/space/get_all_task`,
    SINGLE_SPACE_GET: `${BaseUrl}/space/get`,
    SINGLE_TASK_GET: `${BaseUrl}/task/get_`,
    SPACE_UPDATE_URL: `${BaseUrl}/space/update`,
    UPDATE_TASK:`${BaseUrl}/task/update/`,
    SINGLE_SPACE_DELETE:`${BaseUrl}/space/delete`,
    SINGLE_TASK_DELETE: `${BaseUrl}/task/delete`,
    GET_ALL_SPACE: `${BaseUrl}/space/getAll`,
    BULK_TASK_CREATE: `${BaseUrl}/task/bulk_task_create`,
}