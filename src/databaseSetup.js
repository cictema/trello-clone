var admin = require("firebase-admin");

var serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://trelloclone-6f3d4.firebaseio.com"
});

var db = admin.firestore();

const columns = [
  { id: "column-1", title: "Todo", taskIds: ["task-1"] },
  { id: "column-2", title: "In progress", taskIds: [] },
  { id: "column-3", title: "Review", taskIds: [] },
  { id: "column-4", title: "Completed", taskIds: [] }
]

const columnOrder = ["column-1", "column-2", "column-3", "column-4"]

// Add columns data to the database
columns.forEach(function(obj) {
  db.collection('columns').doc(obj.id).set({
    id: obj.id,
    title: obj.title,
    taskIds: obj.taskIds
  })
});

// Add column order to the database
db.collection('columnOrder').doc("col-order").set({
  columnOrder: columnOrder
})

// Add a task to the database
db.collection('tasks').doc("task-1").set({
  id: "task-1",
  taskTitle: "Demo Task",
  taskDescription: "To be added..."
})