/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { TextField, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from '@mui/icons-material/Delete';
import '../../common_style.css'
import '../spaceTasks/tasklist.css'
import { getSpaceAdminVerify, singleTaskDelete, singleTaskGet } from '../../api-calls/user-request';
import { Updatetaskdetails } from "../../api-calls/user-request"
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));


const TaskList = ({ tasks, spaceStatus, setTaskCreateModalOpen, setTaskEditMode, spaceDataCallback, setCardDelete, spaceData }) => {
    const [taskList, setTaskList] = useState([]);
    const [dragid, Setdragid] = useState()
    const [cardClickAction, setCardClickAction] = useState(null);
    const [taskDetailsId, setTaskDetailsId] = useState()
    const [spaceId, setSpaceId] = useState()
    const open = Boolean(cardClickAction);
    const [activeAdmin, setActiveAdmin] = useState(spaceData)
    const [activeSpaceData, setActiveSpaceData] = useState()
    const [checked,setchecked] = useState(false);
    const { RangePicker } = DatePicker;
    const getPast7Days = () => {
        const end = dayjs(); 
        const start = dayjs().subtract(7, 'day'); 
    
        return [start, end];
      };
    const [dates, setDates] = useState(getPast7Days());

    const dateFilter = () => {
        if (dates && dates.length) {
          const [startDate, endDate] = dates.map(date => new Date(date));
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
    
          return tasks.filter(task => {
            const createdAt = new Date(task.createdAt);
            createdAt.setHours(0, 0, 0, 0);
            return createdAt >= startDate && createdAt <= endDate;
          });
        }
        return tasks;
    };

    useEffect(() => {
        let filteredTasks = tasks;
        if (dates && dates.length) {
          filteredTasks = dateFilter();
        }
        if (checked) {
          filteredTasks = filterByEmail(filteredTasks, localStorage.getItem('mail'));
        }
        setTaskList(filteredTasks);
      }, [tasks, checked, dates]);

    const filterByEmail = (data, email) => {
        return data.filter(item => item.assignee.email === email);
    } 

    useEffect(() => {
        taskList.forEach(item => {
            setSpaceId(item.space)
        });

        if (spaceId) {
            getSpaceAdminVerify(spaceId).then((response) => {
                if (response) {
                    setActiveSpaceData(response.data.Data)
                }
            })
        }
    }, [taskList, spaceId]);



    const handleClose = () => {
        setCardClickAction(null);
    };

    const onDragStart = (evt, id) => {
        Setdragid(id)
        let element = evt.currentTarget;
        element.classList.add("dragged");
        evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
        evt.dataTransfer.effectAllowed = "move";
    };

    const onDragEnd = (evt) => {
        evt.currentTarget.classList.remove("dragged");

    };

    const onDragEnter = (evt) => {
        evt.preventDefault();
        let element = evt.currentTarget;
        element.classList.add("dragged-over");
        evt.dataTransfer.dropEffect = "move";
    };

    const onDragLeave = (evt) => {
        let currentTarget = evt.currentTarget;
        let newTarget = evt.relatedTarget;

        if (newTarget?.parentNode === currentTarget || newTarget === currentTarget)
            return;
        evt.preventDefault();
        let element = evt.currentTarget;
        element.classList.remove("dragged-over");
    };

    const onDragOver = (evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move";
    };

    const onDrop = (evt, value, status,) => {
        evt.preventDefault();
        evt.currentTarget.classList.remove("dragged-over");
        let data = evt.dataTransfer.getData("text/plain");
        let updated = taskList.map((task) => {
            if (task.id.toString() === data.toString()) {
                task.status = status;
            }
            return task;
        });
        setTaskList(updated);
        const currentstatus = evt.currentTarget.classList.value.replace(/small-box\s*/g, '').toUpperCase();
        let updatestatus = {}
        updatestatus = {
            status: currentstatus
        }
        Updatetaskdetails(dragid, updatestatus)
    };

    const separatedData = {};

    spaceStatus.forEach(status => {
        separatedData[status] = [];
    });

    taskList.forEach(item => {
        const status = item.status;
        if (!separatedData[status]) {
            separatedData[status] = [];
        }
        separatedData[status].push(item);
    });

    const stringToColor = (string) => {
        let hash = 0;
        for (let i = 0; i < string?.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'todo':
                return '#ffcccb';
            case 'inprogress':
                return '#87cefa';
            case 'done':
                return '#90ee90';
            default:
                return '#ccc';
        }
    }

    const cardContentOnClick = (id, e) => {
        e.stopPropagation()
        if (id) {
            singleTaskGet(id).then((response) => {
                if (response?.data) {
                    spaceDataCallback(response.data.Data)
                }
            })
        }
        setTaskEditMode(true)
        setTaskCreateModalOpen(true)

    }

    const cardDetailsClick = (event, id) => {
        setTaskDetailsId(id)
        setCardClickAction(event.currentTarget);
        setCardDelete(false)
    }

    const cardDeleteClick = (e) => {
        e.stopPropagation()
        if (taskDetailsId) {
            singleTaskDelete(taskDetailsId).then((response) => {
                if (response?.data) {
                    spaceDataCallback(response.data.Data)
                    setCardClickAction(null);
                    setCardDelete(true)

                }
            })
        }

    }
    const handleChangeMode=()=>{
     setchecked(!checked);
    }

    
    // const createdAt = new Date(task.createdAt);
    // const updatedAt = new Date(obj.updatedAt);
    // const isWithinRange = (date) => date >= dateRange[0] && date <= dateRange[1];

    // if (isWithinRange(createdAt) || isWithinRange(updatedAt)) {
    // console.log('The object is within the date range.');
    // } else {
    // console.log('The object is not within the date range.');
    // }
    const onChange = (values) => {
        setDates(values);
        console.log('Selected Dates:', values);
    }
    return (
        <div>
            <div className='filters-header'>
               <Space direction="vertical" size={12} >
                <RangePicker
                    onChange={onChange}
                    format="YYYY-MM-DD"
                    value={dates}
                />
                </Space>
                <div className='filter-memode'>
                    <FormGroup>
                        <FormControlLabel control={<Switch 
                        checked={checked}
                        onChange={handleChangeMode} />} label="Me" />
                    </FormGroup>
                </div>
            </div>
            <div className="container d-flex">
                {spaceStatus.map(status => (
                    <div
                        key={status}
                        className={`small-box ${status.toLowerCase()}`}
                        onDragLeave={(e) => onDragLeave(e)}
                        onDragEnter={(e) => onDragEnter(e)}
                        onDragEnd={(e) => onDragEnd(e)}
                        onDragOver={(e) => onDragOver(e)}
                        onDrop={(e) => onDrop(e, true, status,)}
                    >
                        <section className="drag-container">
                            <div className="container">
                                <div className="drag-column">
                                    <div className="drag_row d-flex">
                                        <Card className='home-page-status-heading-card cursor-pointer'
                                            style={{ borderTop: `3px solid ${getStatusColor(status)}` }}>
                                            <CardContent className='home-page-status-heading-content'>
                                                <Typography className='home-page-status-heading-name'>
                                                    {status}
                                                </Typography>
                                                <div className='home-page-status-count'>{separatedData[status].length}</div>
                                            </CardContent>
                                        </Card>
                                        {separatedData[status].map((task, index) => (
                                            <div
                                                className="card cursor-pointer"
                                                key={task.name}
                                                id={task.id}
                                                draggable
                                                onDragStart={(e) => onDragStart(e, task._id)}
                                                onDragEnd={(e) => onDragEnd(e)}
                                                onClick={(e) => cardContentOnClick(task._id, e)}

                                            >
                                                <Card className={`task-details-card ${task.status.toLowerCase()}`} key={task.status}>
                                                    <div className='task-details-card-content-div'>
                                                        <div className='d-flex tast-details-card-content-title'>
                                                            <div className='fs-12 fw-500'>{task.task_name}</div>
                                                            <div>
                                                                <Avatar className='fs-14 task-details-card-content-title-avatar' style={{ backgroundColor: stringToColor(task?.assignee?.email) }}>{task?.assignee?.email.charAt(0).toUpperCase()}</Avatar>
                                                            </div>
                                                        </div>
                                                        <div className='empty-div'></div>
                                                        {activeAdmin.company_admin || (activeAdmin.space_admin?.name === activeSpaceData?.name) ? (
                                                            <div onClick={(e) => e.stopPropagation()} className='task-details-card-content-menu-div'>
                                                                <a> <MoreHorizIcon onClick={(e) => cardDetailsClick(e, task._id)} className='' /></a>
                                                                <StyledMenu
                                                                    id="demo-customized-menu"
                                                                    MenuListProps={{
                                                                        'aria-labelledby': 'demo-customized-button',
                                                                    }}
                                                                    transformOrigin={{
                                                                        vertical: 'top',
                                                                        horizontal: 'right',
                                                                    }}
                                                                    anchorEl={cardClickAction}
                                                                    open={open}
                                                                    onClose={handleClose}
                                                                    className=""
                                                                >
                                                                    <MenuItem onClick={(e) => cardDeleteClick(e)} disableRipple>
                                                                        <DeleteIcon />
                                                                        Delete
                                                                    </MenuItem>

                                                                    <MenuItem onClick={handleClose} disableRipple>
                                                                        <MoreHorizIcon />
                                                                        More
                                                                    </MenuItem>
                                                                </StyledMenu>
                                                            </div>) : (<></>)
                                                        }

                                                    </div>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskList;
