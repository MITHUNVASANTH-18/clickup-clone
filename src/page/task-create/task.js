import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Updatetaskdetails } from "../../api-calls/user-request";
import "../../common_style.css";
import "../task-create/task.css";
import { createNewTask } from "../../api-calls/user-request";
const task_type = ["Task", "Bug"];

export default function NewTaskCreate({
  setTaskCreateModalOpen,
  taskCreateModalOpen,
  assigneeEmails,
  activeSpaceName,
  taskEditMode,
  singleSpaceData,
  createtaskcallback,
}) {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("Task");
  const [status, setStatus] = useState("TODO");
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState(null);
  const [id, Setid] = useState("");
  const [spaceid, Setsapaceid] = useState("");
  const [loggedTime, setLoggedTime] = useState("")
  const [loggedHours, setLoggedHours] =useState("")
  const [timeCalculate, setTimeCalculate] = useState(false)

  useEffect(() => {
    if (taskEditMode && singleSpaceData) {
      setTaskName(singleSpaceData.task_name);
      setTaskDescription(singleSpaceData.task_description);
      setTaskType(singleSpaceData.task_type);
      setStatus(singleSpaceData.status);
      setAssignee(singleSpaceData?.assignee?.email);
      Setid(singleSpaceData._id);
      Setsapaceid(singleSpaceData.space);
      setLoggedHours(singleSpaceData.time_logged)
    }
  }, [taskEditMode, singleSpaceData]);


  const taskCreatModalClose = () => {
    setTaskCreateModalOpen(false);
  };

  const handleAssigneeChange = (event) => {
    setAssignee(event.target.value);
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    setTaskName(taskName);
    setTaskType(taskType);
    setStatus(status);
    setAssignee(assignee);
    setTaskDescription(taskDescription);
    SaveDetails(taskName, taskType, status, assignee, taskDescription);
    setTaskCreateModalOpen(false);
    createtaskcallback(false);
    setLoggedTime(loggedTime)
  };

  const handleupdate = () => {
    let data = {};
    data = {
      task_name: taskName,
      task_description: taskDescription,
      task_type: taskType,
      status: status,
      time_logged: loggedTime,
      timeCalculate:timeCalculate,
      assignee: assignee,
    };
    Updatetaskdetails(id, data);
    setTaskCreateModalOpen(false);
  };

  const SaveDetails = (
    taskName,
    taskType,
    status,
    assignee,
    taskDescription
  ) => {
    const data = {
      task_name: taskName,
      task_description: taskDescription,
      task_type: taskType,
      assignee: assignee,
      status: status,
      space: activeSpaceName.name,
      time_logged: loggedTime,
    };
    createNewTask(data)
      .then(function (response) {
        if (response?.data?.Data) {
          setTaskName("");
          setAssignee([]);  
          setTaskDescription("");
          setTaskCreateModalOpen(false);
        } else {
          if (response?.data?.message) {
            setError("Not access to create Space.");
          } else {
            setError("Failed to create space. Please try again.");
          }
        }
      })
      .catch(function (error) {
        setError("An error occurred. Please try again later.");
      });
  };

  const TimeLoggedFun = (e) => {
    setTimeCalculate(true)
    setLoggedTime(e.target.value)
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={taskCreateModalOpen}
      onClose={taskCreatModalClose}
      className="task-create-modal d-flex"
    >
      <Box className="task-create-box">
        <Typography className="fw-600 fs-18">
          {taskEditMode ? <p>Edit task</p> : <p>Create new task</p>}
        </Typography>
        <ValidatorForm
          useref="form"
          onSubmit={handleTaskSubmit}
          className="task-create-form width-100"
        >
          <div className="task-create-text-main-div d-flex">
            <div className="width-45">
              <TextValidator
                label="Summary"
                margin="normal"
                onChange={(e) => setTaskName(e.target.value)}
                name="taskName"
                className="width-100"
                value={taskName}
                id="taskName"
                // required={true}
                InputLabelProps={{ shrink: true }}
                autoFocus
                validators={["required"]}
                errorMessages={["this field is required"]}
                error={Boolean(error)}
              />
              {error && <div className="error-message">{error}</div>} 
            </div>
            <FormControl className="width-45 margin-top">
              <InputLabel id="demo-multiple-name-label">Task type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={taskType}
                label="Task type"
                onChange={(e) => setTaskType(e.target.value)}
              >
                {task_type.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="width-45">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                {activeSpaceName.status.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="width-45">
              <InputLabel id="demo-multiple-chip-label">assignee</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={assignee}
                onChange={handleAssigneeChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="assignee" />
                }
              >
                {assigneeEmails.map((email) => (
                  <MenuItem key={email} value={email}>
                    {email.charAt(0).toUpperCase() + email.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="width-45">
              <TextField
                id="task_description"
                label="Description"
                onChange={(e) => setTaskDescription(e.target.value)}
                multiline
                rows={4}
                ame="task_description"
                className="width-100"
                value={taskDescription}
              />
            </div>
            {taskEditMode ? (
              <div className="date-picker">
                <div className="width-100">
                  <TextValidator
                    label="Logged time"
                    margin="normal"
                    onChange={(e) => TimeLoggedFun(e)}
                    name="Logged time"
                    className="width-100"
                    value={loggedTime}
                    id="loggedTime"
                    InputLabelProps={{ shrink: true }}
                    autoFocus
                    errorMessages={["this field is required"]}
                  />
                </div>
                <div>
                  Logged hours: <span className="fw-600">{loggedHours}</span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="d-flex create-task-button-div">
            {taskEditMode ? (
              <Button variant="contained" onClick={handleupdate} className="">
                Update Task
              </Button>
            ) : (
              <div className="task-create-cancel-button-div d-flex">
                <Button variant="contained" type="submit" className="task-cancel-button" onClick={taskCreatModalClose}>
                  Cancel Task
                </Button>
                <Button variant="contained" type="submit" className="">
                  Create Task
                </Button>
              </div>
            )}
          </div>
        </ValidatorForm>
      </Box>
    </Modal>
  );
}
