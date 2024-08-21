import React from 'react'
import { useDispatch } from 'react-redux';

import { Draggable } from 'react-beautiful-dnd'

// Import Material UI items
import { Card, CardContent, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import SubjectIcon from '@mui/icons-material/Subject';

// Import reducers
import { setCurrTaskIdToEdit, setCurrColIdToEdit, setDialogStatus } from './taskSlice';

function TaskCard({currTaskColId, task, index}) {
  const dispatch = useDispatch();

  function handleEditButtonClick() {
    dispatch(setCurrTaskIdToEdit({taskId: task.id}))
    dispatch(setCurrColIdToEdit({currTaskColId: currTaskColId}))
    dispatch(setDialogStatus(true))
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <Card key={index} cursor="pointer" variant="outlined" style={{marginBottom:"10px"}}>
            <CardContent>
              <div className='task-title-edit-container'>
                <span style={{fontSize: "16px", fontWeight: "700"}}>{task.taskTitle}</span>
                <Tooltip title={"Edit Details"} placement="bottom-start">
                  <EditIcon fontSize="small" cursor="pointer" onClick={handleEditButtonClick}/>
                </Tooltip>
              </div>
              <div>
                {
                  task.taskDescription !== "" ? 
                  <Tooltip title={"This task has description."} placement="bottom-start">
                    <SubjectIcon fontSize="small" cursor="pointer"/>
                  </Tooltip> : null
                }
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}

export default TaskCard
