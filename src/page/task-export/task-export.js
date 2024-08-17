import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect,useState } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import './Export.css'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import * as FileSaver from 'file-saver';
import * as XLSX from 'sheetjs-style';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TaskExport ({setOpenexport,openExport,data,details,activespacedetails}) {
  const [checked,setchecked] = useState(false);
  const { RangePicker } = DatePicker;
  const [filteredExport,setfilteredExport] = useState([]);
  const [Export,setExport] = useState(false);
  const handleChangeMode=()=>{
    setchecked(!checked);

  }
  const handleClose =()=>{
    setOpenexport(!openExport);
  }
  const getPast7Days = () => {
    const end = dayjs(); 
    const start = dayjs().subtract(30, 'day'); 

    return [start, end];
  };
  const [dates, setDates] = useState(getPast7Days());
  const dateFilter = () => {
      if (dates && dates.length) {
        const [startDate, endDate] = dates.map(date => new Date(date));
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        return data.filter(task => {
          const createdAt = new Date(task.createdAt);
          createdAt.setHours(0, 0, 0, 0);
          return createdAt >= startDate && createdAt <= endDate;
        });
      }
      return data;
  };
  const parseTimeLogged = (timeLogged) => {
    let hours = 0;
    let minutes = 0;
    const hoursMatch = timeLogged.match(/(\d+)\s*h/);
    const minutesMatch = timeLogged.match(/(\d+)\s*m/);

    if (hoursMatch) {
        hours = parseInt(hoursMatch[1], 10);
    }

    if (minutesMatch) {
        minutes = parseInt(minutesMatch[1], 10);
    }

    return { hours, minutes };
};

  useEffect(()=>{
    const filtered= dateFilter()
    const taskDetails = filtered.map((exportData) => ({
      task_type: exportData.task_type,
      task_name: exportData.task_name,
      description: exportData.task_description,
      status: exportData.status,
      assignee: exportData.assignee?.email,
      reporter: exportData.reporter?.email,
      time_logged: exportData.time_logged,
      date: exportData.createdAt,
      Hours:parseTimeLogged(exportData.time_logged).hours,
      Minutes:parseTimeLogged(exportData.time_logged).minutes,
    }));
    setfilteredExport(taskDetails);
  },[]);

  const exportData=()=>{
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    const fileExtension = ".xlsx"
    const fileName = details[activespacedetails].name

    const ws = XLSX.utils.json_to_sheet(filteredExport);
    ws["A1"].s = { font: { bold: true, color: { rgb: "FF0000" } } };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'data');

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
    
  }

  const onChange = (values) => {
    setDates(values);
    console.log('Selected Dates:', values);
  }

  const exportDataFunction =() =>{
    exportData()
  };

  const processTasks = () => {
    const parseTimeLogged = (timeLogged) => {
        let hours = 0;
        let minutes = 0;
        if (/^\d+(\.\d+)?$/.test(timeLogged)) {
            hours = parseFloat(timeLogged);
            return { hours: Math.floor(hours), minutes: (hours % 1) * 60 };
        }
        const hoursMatch = timeLogged.match(/(\d+)\s*h/);
        const minutesMatch = timeLogged.match(/(\d+)\s*m/);

        if (hoursMatch) {
            hours = parseInt(hoursMatch[1], 10);
        }

        if (minutesMatch) {
            minutes = parseInt(minutesMatch[1], 10);
        }

        return { hours, minutes };
    };
    const updatedTasks = data.map(task => {
        const { hours, minutes } = parseTimeLogged(task.time_logged);
        return {
            ...task,
            Hours: hours,
            Minutes: minutes
        };
    });
    const total = updatedTasks.reduce((acc, task) => {
        acc.totalHours += task.Hours;
        acc.totalMinutes += task.Minutes;
        return acc;
    }, { totalHours: 0, totalMinutes: 0 });
    const additionalHours = Math.floor(total.totalMinutes / 60);
    total.totalHours += additionalHours;
    total.totalMinutes = total.totalMinutes % 60;
    const result = [...filteredExport, { totalHours: total.totalHours, totalMinutes: total.totalMinutes }];
    setfilteredExport(result);
};

  useEffect(()=>{
    if(checked){
      processTasks()
    }
  },[checked])

  return (
    <div>
      <Modal
        open={openExport}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Export data
          </Typography>
          <div className='date-picker-export'> 
            <p>Date range :</p>
            <Space direction="vertical" size={12} >
            <RangePicker
                onChange={onChange}
                format="YYYY-MM-DD"
                value={dates}
            />
            </Space>
          </div>
          <div className='Selected-columns'>
            <div className='selected-header'>
              <p>Export with total hours</p>
              <FormGroup>
                  <FormControlLabel control={<Switch 
                  checked={checked}
                  onChange={handleChangeMode} />} />
              </FormGroup>
            </div>
          </div>
          <div className='button-container-export'>
          <Button variant="contained" type="submit" className=""onClick={exportDataFunction}>
          Export
          </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
