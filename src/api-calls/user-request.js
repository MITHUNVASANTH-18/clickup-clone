import axios from "axios";
import { SIGNUP_URL, LOGIN_URL, GET_MEMBERS, CREATE_SPACE, GET_SPACE, CREATE_TASK, SPACE_GET_ALL_TASK, SINGLE_SPACE_GET, SINGLE_TASK_GET, SPACE_UPDATE_URL, UPDATE_TASK, SINGLE_SPACE_DELETE, SINGLE_TASK_DELETE, GET_ALL_SPACE, BULK_TASK_CREATE} from "./api-urls";

export function userSignup(userEntry) {
  return axios({
    method: "post",
    url: SIGNUP_URL,
    headers: {},
    data: userEntry,
  });
}

export function userLogin(userEntry) {
  return axios({
    method: "post",
    url: LOGIN_URL,
    headers: {},
    data: userEntry,
    withCredentials: true,
  });
}

export function getMembers() {
  return axios({
    method: "get",
    url: GET_MEMBERS,
    headers:{},
    withCredentials: true,
  });
}

export function createSpace(data) {
  return axios({
    method: "post",
    url: CREATE_SPACE,
    headers:{},
    data: data,
    withCredentials: true,
  });
}

export function getCompanySpace() {
  return axios({
    method: "get",
    url: GET_SPACE,
    headers:{},
    withCredentials: true,
  });
}

export function createNewTask(data) {
  return axios({
    method: "post",
    url: CREATE_TASK,
    headers:{},
    data: data,
    withCredentials: true,
  });
}

export function spaceGetAllTask(id) {
  return axios({
    method: "get",
    url: `${SPACE_GET_ALL_TASK}/${id}`,
    headers:{},
    withCredentials: true,
  });
}

export function singleSpaceGet(id) {
  return axios({
    method: "get",
    url: `${SINGLE_SPACE_GET}/${id}`,
    headers:{},
    withCredentials: true,
  });
}

export function singleTaskGet(id) {
  return axios({
    method: "get",
    url: `${SINGLE_TASK_GET}${id}`,
    headers:{},
    withCredentials: true,
  });
}

export function spaceDataUpdate(data, id) {
  return axios({
    method: "put",
    url: `${SPACE_UPDATE_URL}/${id}`,
    headers:{},
    data: data,
    withCredentials: true,
  });
}

export function Updatetaskdetails(id,body) {
  return axios({
    method: "put",
    url: `${UPDATE_TASK}${id}`,
    headers:{},
    data:body,
    withCredentials: true,
  });
}

export function singleSpaceDelete(id) {
  return axios({
    method: "delete",
    url: `${SINGLE_SPACE_DELETE}/${id}`,
    headers:{},
    withCredentials: true,
  });
}

export function singleTaskDelete(id) {
  return axios({
    method: "delete",
    url: `${SINGLE_TASK_DELETE}/${id}`,
    headers:{},
    withCredentials: true,
  });
}

export function getSpaceAdminVerify(spaceId) {
  return axios({
    method: "get",
    url: `${GET_ALL_SPACE}?spaceId=${spaceId}`,
    headers:{},
    withCredentials: true,
  });
}

export function bulkTaskCreate(data) {
  return axios({
    method: "post",
    url: BULK_TASK_CREATE,
    headers:{},
    data: data,
    withCredentials: true,
  });
}