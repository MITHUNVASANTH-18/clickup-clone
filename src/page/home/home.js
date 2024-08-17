/* eslint-disable jsx-a11y/anchor-is-valid */
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useEffect, useState, useRef } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskList from "../spaceTasks/tasklist";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import * as FileSaver from 'file-saver';
import * as XLSX from 'sheetjs-style';
import TaskExport from "../task-export/task-export";


import {
  createSpace,
  getMembers,
  getCompanySpace,
  spaceGetAllTask,
  singleSpaceGet,
  spaceDataUpdate,
  singleSpaceDelete,
  bulkTaskCreate,
} from "../../api-calls/user-request";
import NewTaskCreate from "../task-create/task";
import "../../common_style.css";
import "../home/home.css";

const statusValues = ["TODO", "INPROGRESS", "DONE"];

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    minWidth: 180,
    color:
      theme.palette.mode === "light"
      ? "rgb(55, 65, 81)"
      : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export default function HomePage() {
  const [spaceCreateOpen, setSpaceCreateOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");
  const [membersChips, setMembersChips] = useState([]);
  const [emails, setEmails] = useState([]);
  const [spaceNameDetails, setSpaceNameDetails] = useState([]);
  const [error, setError] = useState(null);
  const [activeSpace, setActiveSpace] = useState(0);
  const [spaceStatus, setSpaceStatus] = useState([]);
  const [taskCreateModalOpen, setTaskCreateModalOpen] = useState(false);
  const [spaceAllTask, setSpaceAllTask] = useState([]);
  const [spaceEditMode, setSpaceEditMode] = useState(false);
  const [taskEditMode, setTaskEditMode] = useState(false);
  const [singleSpaceData, setSingleSpaceData] = useState();
  const [spaceClickAction, setSpaceClickAction] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState({ id: null, index: -1 });
  const [spacedata, Setsapacedata] = useState([]);
  const [adduser, Setadduser] = useState(false);
  const [assignees, Setassignees] = useState([]);
  const open = Boolean(spaceClickAction);
  const [cardDelete, setCardDelete] = useState(false)
  const [spaceAdmins, setSpaceAdmins] = useState([])
  const [taskExportDetails, setTaskExportDetails] = useState([])
  const [importedData, setImportedData] = useState([]);
  const fileInputRef = useRef(null);
  const [openExport, setOpenExport] = useState(false);


  useEffect(() => {
    getMembers().then((response) => {
      if (response?.data) {
        setCompanyName(response.data.name);
        const extractedEmails = response.data.Data.map((data) => data.email);
        setEmails(extractedEmails);
      }
    });
    fetchspace();
  }, [taskCreateModalOpen, spaceClickAction, setSpaceName]);

  useEffect(() => {
    fetchspacedetails();
  }, [activeSpace, spaceNameDetails, taskCreateModalOpen, cardDelete, importedData]);

  const handleClose = () => {
    setSpaceClickAction(null);
  };

  const fetchspace = () => {
    getCompanySpace().then((response) => {
      if (response?.data) {
        Setsapacedata(response.data);
        const spaceDetails = response.data.Data.map((data) => ({
          name: data.name,
          status: data.status,
          id: data._id,
        }));
        setSpaceNameDetails(spaceDetails);
        setSpaceStatus(spaceDetails.map((detail) => detail.status));
      }
    });
  };

  const fetchspacedetails = () => {
    if (spaceNameDetails[activeSpace]?.id) {
      spaceGetAllTask(spaceNameDetails[activeSpace]?.id).then((response) => {
        if (response?.data) {
          setSpaceAllTask(response.data.Data);
          Setassignees([...new Set(spaceAllTask.map(task => task.assignee?.email).filter(email => email))])
        }
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!spaceName.trim()) {
      setError("Space name cannot be empty.");
      return;
    }
    setSpaceName(spaceName);
    setDescription(description);
    setMembersChips(membersChips);
    setSpaceAdmins(spaceAdmins)
    SaveDetails(spaceName, description, membersChips, spaceAdmins);
    fetchspace();
  };

  const SaveDetails = (spaceName, description, membersChips, spaceAdmins) => {
    const userEntry = {
      name: spaceName,
      description: description,
      members: membersChips,
      status: statusValues,
      admins: spaceAdmins
    };

    const filterEmptyValues = (entry) => {
      const filteredEntry = {};
      Object.keys(entry).forEach((key) => {
        if (entry[key] !== "" && entry[key].length !== 0) {
          filteredEntry[key] = entry[key];
        }
      });
      return filteredEntry;
    };

    if (spaceEditMode) {
      const filteredUserEntry = filterEmptyValues(userEntry);
      const { id } = selectedSpace;
      spaceDataUpdate(filteredUserEntry, id);
    } else {
      createSpace(userEntry)
        .then(function (response) {
          if (response?.data?.Data) {
            setSpaceName("");
            setDescription("");
            setMembersChips([]);
            setSpaceCreateOpen(false);
            setSpaceAdmins([])
            fetchspace();
          } else {
            if (response?.data?.message) {
              setError("Not access to create Space.");
            }
            if (response?.data?.error) {
              setError("already exist space name.");
            } else {
              setError("Failed to create space. Please try again.");
            }
          }
        })
        .catch(function (error) {
          setError("An error occurred. Please try again later.");
        });
    }
  };

  const handleSpaceCreateOpen = () => {
    setSpaceEditMode(false);
    setSpaceCreateOpen(true);
  };

  const handleSpaceCreateClose = () => {
    setError(null);
    setSpaceName("");
    setDescription("");
    setMembersChips([]);
    setSpaceCreateOpen(false);
    Setadduser(false)
  };

  const handleChange = (event) => {
    setMembersChips(event.target.value);
    Setassignees(event.target.value)
  };

  const spaceAdminsHandleChange = (event) => {
    setSpaceAdmins(event.target.value);
  };

  const handleTabClick = (index, e) => {
    e.stopPropagation();
    setActiveSpace(index);
  };

  const handleTaskCreatOpen = () => {
    setTaskEditMode(false);
    setTaskCreateModalOpen(true);
  };

  const handleDelete = (e, value) => {
    e.preventDefault();
    setMembersChips((chips) => chips.filter((chip) => chip !== value));
  };

  spaceAllTask.forEach((element, index) => {
    element.id = index + 1;
  });

  const SpaceDetailsClick = (event, detail, index) => {
    setSpaceClickAction(event.currentTarget);
    setSelectedSpace({ id: detail.id, index: index });
  };

  const spaceEditActionClick = () => {
    const { id } = selectedSpace;
    if (id) {
      singleSpaceGet(id).then((response) => {
        if (response?.data) {
          setSpaceName(response.data.Data.name);
        }
      });
    }
    setSpaceClickAction(null);
    setSpaceEditMode(true);
    setSpaceCreateOpen(true);
  };

  const spaceDeleteActionClick = () => {
    const { id } = selectedSpace;
    if (id) {
      singleSpaceDelete(id).then((response) => {
        if (response?.data) {
          console.log(response.data);
        }
      });
    }
    setSpaceClickAction(null);
  };

  const spaceDataCallback = (childValue) => {
    setSingleSpaceData(childValue);
  };

  const createtaskcallback = (value) => {
    if (value === false) {
      fetchspacedetails();
    }
  };

  const adduseropen = () => {
    Setadduser(true);
  };

  const Edituser = () => {
    const id = spaceNameDetails[activeSpace]?.id
    let data = {}
    data = {
      email: assignees
    }
    spaceDataUpdate(data, id)
  }

  const taskExportClick = () => {
    const taskDetails = spaceAllTask.map((data) => ({
      task_type: data.task_type,
      task_name: data.task_name,
      description: data.task_description,
      status: data.status,
      assignee: data.assignee?.email,
      reporter: data.reporter?.email,
      time_logged: data.time_logged,
      date: data.createdAt
    }));
    setTaskExportDetails(taskDetails);
    setOpenExport(true);
  }

  const taskImportFileUpload = (e) => {
    debugger
    const file = e.target.files[0];
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const columns = rawData[0];
        const data = rawData.slice(1).map(row => {
          const rowData = {};
          columns.forEach((column, index) => {
            if (row[index] !== undefined && row[index] !== null && row[index] !== '') {
              rowData[column] = row[index];
            }
          });
          return rowData;
        });
        const filteredData = data.filter(entry =>
          entry.task_type !== undefined && entry.task_name !== undefined && entry.status !== undefined
        );

        const finalData = filteredData.filter(entry => Object.keys(entry).length !== 0);
        setImportedData(finalData);

        if (finalData && spaceNameDetails[activeSpace]?.name) {
          const data = {
            finalData: finalData,
            space: spaceNameDetails[activeSpace]?.name
          }
          bulkTaskCreate(data)
            .then(function (response) {
              fileInputRef.current.value = "";
              setImportedData(response.data.Data);
              console.log(response)
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      };

      reader.readAsBinaryString(file);
    } else {
      console.log('Invalid file type. Please select an XLSX file.');
    }
  };


  return (
    <>
      <div className="d-flex home-page-main-div">
        <div className="home-page-first-main-div">
          <div className="company-name-avatar-div d-flex">
            <Avatar variant="square" className="company-avatar fs-14">
              {companyName.charAt(0).toUpperCase()}
            </Avatar>
            <Button className="company-name">{companyName}</Button>
          </div>
          <div className="create-space-icon-div">
            <div className="d-flex create-space-icon">
              {" "}
              Space{" "}
              {spacedata.company_admin ? (
                <AddIcon
                  className="cursor-pointer"
                  onClick={handleSpaceCreateOpen}
                />
              ) : (
                <></>
              )}{" "}
            </div>
          </div>
          <div className="space-names-div">
            {spaceNameDetails.map((detail, index) => (
              <div
                key={index}
                className={`space-name-edit cursor-pointer d-flex ${activeSpace === index ? "active-tab" : ""
                  }`}
                onClick={(e) => handleTabClick(index, e)}
              >
                <a key={index} className="d-flex space-name-common-a-tag">
                  <Avatar variant="square" className="space-avatar fs-12">
                    {detail.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <div
                    key={index}
                    className={`${detail.name}-div space-name-common-div fs-14`}
                  >
                    {detail.name}
                  </div>
                </a>
                {spacedata.company_admin || (detail?.name === spacedata.space_admin?.name) ? (<div onClick={(e) => e.stopPropagation()}>
                  <a>
                    <MoreHorizIcon
                      onClick={(e) => SpaceDetailsClick(e, detail, index)}
                      className="edit-icon"
                    />
                  </a>
                  <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                      "aria-labelledby": "demo-customized-button",
                    }}
                    anchorEl={spaceClickAction}
                    open={open}
                    onClose={handleClose}
                    className="menu-item-style"
                  >
                    <MenuItem
                      onClick={() => spaceEditActionClick(detail.id, index)}
                      disableRipple
                    >
                      <EditIcon />
                      Edit
                    </MenuItem>
                    {spacedata.company_admin ? (
                      <MenuItem
                        onClick={() => spaceDeleteActionClick(detail.id, index)}
                        disableRipple
                      >
                        <DeleteIcon />
                        Delete
                      </MenuItem>
                    ) : (<></>)
                    }
                    <MenuItem onClick={() => adduseropen()}>
                      <PersonAddAltIcon />
                      Add user
                    </MenuItem>
                  </StyledMenu>
                </div>) : (<></>)
                }

              </div>
            ))}
          </div>
        </div>
        <div className="home-page-second-main-div">
          {spaceNameDetails[activeSpace] ? (
            <div className="d-flex active-space-name-task-create-div">
              <div className="home-page-active-space-name d-flex">
                <Avatar variant="square" className="active-space-avatar fs-12">
                  {spaceNameDetails[activeSpace]?.name.charAt(0).toUpperCase()}
                </Avatar>
                <div className="active-space-name">
                  {spaceNameDetails[activeSpace]?.name}
                </div>
              </div>
              <div className="d-flex task-import-export-create-div">
                {spacedata.company_admin || (spaceNameDetails[activeSpace]?.name === spacedata.space_admin?.name) ? (
                  <div className="d-flex task-import-export-div">
                    <div className="task-import-export-button-div">
                      <Button
                        component="label"
                        variant="contained"
                        className="export-task-button"
                        tabIndex={-1}
                        onChange={taskImportFileUpload}
                      >
                        <ImportExportIcon />import  <VisuallyHiddenInput type="file" accept=".xlsx" ref={fileInputRef} />
                      </Button>
                    </div>
                    <div className="task-import-export-button-div">
                      <Button
                        onClick={taskExportClick}
                        variant="contained"
                        className="export-task-button"
                      >
                        <ImportExportIcon />export
                      </Button>
                    </div>
                  </div>) : (<></>)}
                <div className="task-create-button-div">
                  <Button
                    onClick={handleTaskCreatOpen}
                    variant="contained"
                    className="create-task-button"
                  >
                    Add Task
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="status-name-with-card-content">
            <div className="task-details-card-div">
              {spaceStatus[activeSpace] && spaceAllTask.length !== -1 ? (
                <TaskList
                  tasks={spaceAllTask}
                  spaceStatus={spaceStatus[activeSpace]}
                  setTaskCreateModalOpen={setTaskCreateModalOpen}
                  setTaskEditMode={setTaskEditMode}
                  spaceDataCallback={spaceDataCallback}
                  singleSpaceData={singleSpaceData}
                  setCardDelete={setCardDelete}
                  spaceData={spacedata}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={spaceCreateOpen}
          className="space-modal-div d-flex"
          onClose={handleSpaceCreateClose}
        >
          <Box className={spaceEditMode ? "space-modal-box-edit d-flex" : "space-modal-box-div d-flex"}>
            {spaceEditMode ? (
              <Typography className="fw-600 fs-18">Edit Space name</Typography>
            ) : (
              <Typography className="fw-600 fs-18">Create new Space</Typography>
            )}
            <ValidatorForm
              useref="form"
              onSubmit={handleSubmit}
              className="width-100 d-flex space-text-field-form"
            >
              {spaceEditMode ? (
                <div className="space-text-field-div width-100 d-flex space-edit-mode">
                  <TextValidator
                    label="Space name"
                    margin="normal"
                    onChange={(e) => setSpaceName(e.target.value)}
                    name="space"
                    className="width-100 space-name-div"
                    value={spaceName}
                    id="space"
                    required={true}
                    InputLabelProps={{ shrink: true }}
                    autoFocus
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                    error={Boolean(error)}
                  />
                  {error && <div className="error-message">{error}</div>}
                </div>
              ) : (
                <div className="space-text-field-div width-100 d-flex">
                  <TextValidator
                    label="Space name"
                    margin="normal"
                    onChange={(e) => setSpaceName(e.target.value)}
                    name="space"
                    className="width-100 space-name-div"
                    value={spaceName}
                    id="space"
                    // required={true}
                    InputLabelProps={{ shrink: true }}
                    autoFocus
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                    error={Boolean(error)}
                  />
                  {error && <div className="error-message">{error}</div>}
                  <TextValidator
                    label="Description"
                    margin="normal"
                    onChange={(e) => setDescription(e.target.value)} // Assuming you have a setDescription function
                    name="description"
                    className="width-100 space-description-div"
                    value={description}
                    id="description"
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl className="width-100 space-creat-members">
                    <InputLabel id="demo-multiple-chip-label">
                      Members
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={membersChips}
                      onChange={handleChange}
                      input={
                        <OutlinedInput
                          id="select-multiple-chip"
                          label="Members"
                        />
                      }
                      renderValue={(selected) => (
                        <div>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              clickable
                              deleteIcon={
                                <DeleteIcon
                                  onMouseDown={(event) =>
                                    event.stopPropagation()
                                  }
                                />
                              }
                              onDelete={(e) => handleDelete(e, value)}
                            />
                          ))}
                        </div>
                      )}
                    >
                      {emails.map((email) => (
                        <MenuItem key={email} value={email}>
                          {email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl className="width-100 space-creat-members">
                    <InputLabel id="demo-multiple-chip-label">
                      Select admins
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={spaceAdmins}
                      onChange={spaceAdminsHandleChange}
                      input={
                        <OutlinedInput
                          id="select-multiple-chip"
                          label="Select admins"
                        />
                      }
                      renderValue={(selected) => (
                        <div>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              clickable
                              deleteIcon={
                                <DeleteIcon
                                  onMouseDown={(event) =>
                                    event.stopPropagation()
                                  }
                                />
                              }
                              onDelete={(e) => handleDelete(e, value)}
                            />
                          ))}
                        </div>
                      )}
                    >
                      {emails.map((email) => (
                        <MenuItem key={email} value={email}>
                          {email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
              {/* {error && <div className="error-message">{error}</div>} */}
              {spaceEditMode ? (
                <Button
                  variant="contained"
                  type="submit"
                  className="create-space-button"
                >
                  Update Space
                </Button>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  className="create-space-button"
                >
                  Create Space
                </Button>
              )}
            </ValidatorForm>
          </Box>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={adduser}
          className="space-modal-div d-flex"
          onClose={handleSpaceCreateClose}
        >
          <Box className="space-modal-box-users d-flex">
            <Typography className="fw-600 fs-18">Edit Users </Typography>
            <FormControl className="width-100 space-creat-members">
              <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={assignees}
                onChange={handleChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Members" />
                }
                renderValue={(selected) => (
                  <div>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        clickable
                        deleteIcon={
                          <DeleteIcon
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        }
                        onDelete={(e) => handleDelete(e, value)}
                      />
                    ))}
                  </div>
                )}
              >
                {emails.map((email) => (
                  <MenuItem key={email} value={email}>
                    {email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => (Edituser())}
              className="create-space-button"
            >
              Edit user
            </Button>
          </Box>
        </Modal>
        {taskCreateModalOpen ? (
          <NewTaskCreate
            createtaskcallback={createtaskcallback}
            taskCreateModalOpen={taskCreateModalOpen}
            setTaskCreateModalOpen={setTaskCreateModalOpen}
            activeSpaceName={spaceNameDetails[activeSpace]}
            assigneeEmails={emails}
            taskEditMode={taskEditMode}
            singleSpaceData={singleSpaceData}
            spaceAllTask={spaceAllTask}
          />
        ) : null}
        {openExport ?(
          <TaskExport
          setOpenexport={setOpenExport}
          openExport={openExport}
          data={spaceAllTask}
          details={spaceNameDetails}
          activespacedetails={activeSpace}
          />
        ) : null

        }

      </div>
    </>
  );
}
