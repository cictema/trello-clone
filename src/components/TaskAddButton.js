import React from 'react'
import { useDispatch } from 'react-redux';

// Import Material UI icon
import AddIcon from '@mui/icons-material/Add';

// Import reducer
import { addNewTask } from './taskSlice';

function TaskAddButton({colId}) {
  const dispatch = useDispatch();

  function handleNewTask() {
    dispatch(addNewTask({colId: colId}));
  }

  return (
    <div>
      <button style={{ color: "white", backgroundColor: "#009D5E",fontSize: "20", borderRadius: "5px", border: "none", padding: "5px 10px 5px 5px", cursor: "pointer"}}
      className='add-task-button' onClick={handleNewTask}>
        <div 
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <AddIcon />
          {"Add a card"}
        </div>
      </button>
    </div>
  )
}

export default TaskAddButton
