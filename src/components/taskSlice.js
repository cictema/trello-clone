import { createSlice } from '@reduxjs/toolkit';
import {db} from '../firebase'
import {doc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove} from 'firebase/firestore'

const initialState = {
  tasks: {},
  columns: {},
  columnOrder: [],
  currTaskIdToEdit: "",
  currColIdToEdit: "",
  isDialogOpen: false,
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Default reducers start
    // Sets "currTaskIdToEdit" to the id of the current task being edited
    setCurrTaskIdToEdit: (state, action) => {
      state.currTaskIdToEdit = action.payload.taskId
    },
    // Sets "currColIdToEdit" to the id of the current column in which the task is being edited
    setCurrColIdToEdit: (state, action) => {
      state.currColIdToEdit = action.payload.currTaskColId
    },
    // Changes the state of the edit dialog box between open and close
    setDialogStatus: (state, action) => {
      state.isDialogOpen = action.payload
    },
    // Default reducers end
    setAllTasks: (state, action) => {
        let finalTasks = {}
        action.payload.map(task => (
            finalTasks[task["id"]] = task
        ))

        state.tasks = finalTasks
    },
    setAllColumns: (state, action) => {
      let finalColumns = {}
      action.payload.map(column => (
         finalColumns[column["id"]] = column
      ))

      state.columns = finalColumns
    },
    setColumnOrder: (state, action) => {
      state.columnOrder = action.payload['columnOrder']
    },
    dragColumns: (state, action) => {
      const columnOrderDocRef = doc(db, 'columnOrder', 'col-order')
      updateDoc(columnOrderDocRef, {
        columnOrder: action.payload
      })

      state.columnOrder = action.payload;
    },
    dragTasksDifferentColumn: (state, action) => {
      let { srcColId, srcTaskIds, dstColId, dstTaskIds } = action.payload;

      const srcColDocRef = doc(db, 'columns', srcColId)
      updateDoc(srcColDocRef, {
        taskIds: srcTaskIds
      })

      const dstColDocRef = doc(db, 'columns', dstColId)
      updateDoc(dstColDocRef, {
        taskIds: dstTaskIds
      })

      state.columns[srcColId].taskIds = srcTaskIds
      state.columns[dstColId].taskIds = dstTaskIds
    },
        dragTasksSameColumn: (state, action) => {
      const colId = action.payload.id
      const taskIds = action.payload.taskIds
   
      const colDocRef = doc(db, 'columns', colId)
      updateDoc(colDocRef, {
        taskIds: taskIds
      })

      state.columns[colId].taskIds = taskIds
    },
    addNewTask: (state, action) => {
      let colId = action.payload.colId
      
      // get the keys of the tasks object
      let keys = Object.keys(state.tasks).sort()
      keys.sort((a, b) => a.replace(/[^\d]+/g, '') - b.replace(/[^\d]+/g, ''));
      
      // Get the id of the task present at the end of the tasks object 
      let lastId = "task-0"
      if(keys.length !== 0) {
          lastId = keys[keys.length - 1]
      }

      // set the integer id of the next task
      let nextId = parseInt(lastId.split("-")[1]) + 1
      let newTaskId = "task-" + nextId.toString()

      try {
          // Add a new task to the "tasks" collection 
          setDoc(doc(db, 'tasks', newTaskId), {
          id: newTaskId,
          taskTitle: "New Task",
          taskDescription: ""
          })

          const colDocRef = doc(db, 'columns', colId)
          // Update the "columns" collection 
          updateDoc(colDocRef, {
          taskIds: arrayUnion(newTaskId)
          })
      } catch (err) {
          alert(err)
      }
      
      // Add the new task in the tasks object of the initial state
      state.tasks[newTaskId] = {
          id: newTaskId,
          taskTitle: "New Task",
          taskDescription: ""
      }

      // Append the new task id to the taskIds list of the particular column
      state.columns[colId].taskIds.push(newTaskId)
    },
    updateTask: (state, action) => {
      const {id, taskTitle, taskDescription} = action.payload

      const updatedTask = {
        id: id,
        taskTitle: taskTitle,
        taskDescription: taskDescription
      }
   
      // update the data base only if the task title or task description changes
      if (state.tasks[id].taskTitle !== taskTitle || state.tasks[id].taskDescription !== taskDescription) {
        const taskDocRef = doc(db, 'tasks', id)
        updateDoc(taskDocRef, {
          taskTitle: taskTitle,
          taskDescription: taskDescription
        })
      }
      state.tasks[id] = updatedTask
    },
    deleteTask: (state, action) => {
      const taskId = action.payload.taskId;
      const colId = state.currColIdToEdit;

      // update the database
      // -- delete the task from the "tasks" collection of the database
      const taskDocRef = doc(db, 'tasks', taskId)
      deleteDoc(taskDocRef)

      // -- update the taskIds array in the "columns" collection of the database
      const colDocRef = doc(db, 'columns', colId)
      updateDoc(colDocRef, {
        taskIds: arrayRemove(taskId)
      })

      // update the redux state
      state.columns[colId].taskIds = state.columns[colId].taskIds.filter(item => item !== taskId)
      delete state.tasks[taskId];
    },

  },
});

export const { setAllTasks, setAllColumns, setColumnOrder, dragColumns, dragTasksSameColumn, dragTasksDifferentColumn, addNewTask, updateTask, deleteTask, setCurrTaskIdToEdit, setCurrColIdToEdit, setDialogStatus } = taskSlice.actions;

export default taskSlice.reducer;
