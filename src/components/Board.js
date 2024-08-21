import React, { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { dragColumns, dragTasksDifferentColumn, dragTasksSameColumn } from './taskSlice';
import Column from './Column'
import EditTaskDialog from './EditTaskDialog'
import {db} from '../firebase'
import {collection, query, onSnapshot} from "firebase/firestore"

// Import the dataset
import dataset from './dataset'

// Import redux functions and reducers
import { useDispatch, useSelector } from 'react-redux';
import { setAllTasks, setAllColumns, setColumnOrder } from './taskSlice';

function Board () {
  //  get data from the redux stpre
  const data = useSelector((state) => state.task);
  const dispatch = useDispatch();

   function onDragEnd(result) {
      const { destination, source, draggableId, type } = result;

      //If there is no destination present
      if (!destination) { 
          return
      }

      //If the source and destination is the same
      if (destination.droppableId === source.droppableId && destination.index === source.index) { 
          return 
      }

      //If columns are being dragged
      if (type === 'column') {
          const colOrderNew = Array.from(data.columnOrder);
          colOrderNew.splice(source.index, 1);
          colOrderNew.splice(destination.index, 0, draggableId);
          
          dispatch(dragColumns(colOrderNew))
          return;
      }

      const src = data.columns[source.droppableId];
      const dst = data.columns[destination.droppableId];

      // If a task is dropped inside the same column
      if (src === dst) {
          const newTaskIds = Array.from(src.taskIds);
          newTaskIds.splice(source.index, 1);
          newTaskIds.splice(destination.index, 0, draggableId);

          const updatedColumn = {
              ...src,
              taskIds: newTaskIds
          }

          dispatch(dragTasksSameColumn(updatedColumn))
          return;
      }

      // If a task is dropped in a different column
      const srcColId = src["id"];
      const srcTaskIds = Array.from(src.taskIds);
      srcTaskIds.splice(source.index, 1);

      const dstColId = dst["id"];
      const dstTaskIds = Array.from(dst.taskIds);
      dstTaskIds.splice(destination.index, 0, draggableId);

      dispatch(dragTasksDifferentColumn({
          srcColId: srcColId,
          srcTaskIds: srcTaskIds,
          dstColId: dstColId,
          dstTaskIds: dstTaskIds
      }))
  }


  useEffect(() => {
      // Query Tasks from the databse
      const queryTasks = query(collection(db, 'tasks'))
      let tasks = [];
      onSnapshot(queryTasks, (querySnapshot) => {
          querySnapshot.docs.map(doc => (
          tasks.push(doc.data())
          ))
          dispatch(setAllTasks(tasks))
      })

      // Query Columns from the databse
      const queryColumns = query(collection(db, 'columns'))
      let columns = [];
      onSnapshot(queryColumns, (querySnapshot) => {
          querySnapshot.docs.map(doc => (
          columns.push(doc.data())
          ))
          dispatch(setAllColumns(columns))
      })

      // Query COlumn Order from the databse
      const queryColumnOrder = query(collection(db, 'columnOrder'))
      let columnOrder = [];
      onSnapshot(queryColumnOrder, (querySnapshot) => {
          querySnapshot.docs.map(doc => (
          columnOrder = doc.data()
          ))
          dispatch(setColumnOrder(columnOrder))
      })
  }, [dispatch])


  return (
    <>
      <div style={{textAlign: "center", color: "white"}}>
        <h1>Kanban Board</h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={{display: "flex"}}>
              {data.columnOrder.map((colId, index) => {
                // Replace this with the Column component later
                return <Column key={colId} colId={colId} index={index}/>
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {data.isDialogOpen ?
          <EditTaskDialog taskId={data.currTaskIdToEdit} open={data.isDialogOpen} /> :
          null
}
    </>
  )
}

export default Board
