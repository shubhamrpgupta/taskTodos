const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Task = require("./models/task");
const errorMiddleware = require("./middleware/error");
const catchAsyncError = require("./middleware/catchAsyncError");
const ApiFeatures = require("./utils/apiFeatures");

const app = express();

const MongoDbUrl = 'mongodb://127.0.0.1:27017/todoTest';

main().catch(err => console.log(`Mongo ERROR, ${err}`));
async function main() {
    await mongoose.connect(MongoDbUrl);
    console.log("MONGO CONNECTION OPEN!!")
}

app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);


//List of all the tasks
app.get("/tasks", catchAsyncError(async (req, res) => {

    const resultPerPage = 5
    const apiFeature = new ApiFeatures(Task.find(), req.query)
        .pagination(resultPerPage)

    const showAllTask = await apiFeature.query;

    res.status(200).json({ success: true, showAllTask })
}))


//Single task with the ID
app.get("/tasks/:id", catchAsyncError(async (req, res, next) => {
    const showTaskById = await Task.findById(req.params.id);

    if (!showTaskById) {
        return next(new ErrorHandler("Task not found with this Id", 404))
    }

    res.status(200).json({ success: true, showTaskById })
}))


//Create new Task
app.post("/tasks", catchAsyncError(async (req, res) => {

    const newTask = await Task.create(req.body);
    res.status(200).json({ success: true, newTask })

}))


//Edit the Task with the ID
app.put("/tasks/:id", catchAsyncError(async (req, res, next) => {
    const foundTask = await Task.findById(req.params.id);

    if (!foundTask) {
        return next(new ErrorHandler("Task not found with this Id", 404))
    }

    const findAndUpdateTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({ success: true, findAndUpdateTask })
}))


//Delete the Task with ID
app.delete("/tasks/:id", catchAsyncError(async (req, res, next) => {
    const foundTask = await Task.findById(req.params.id);

    if (!foundTask) {
        return next(new ErrorHandler("Task not found with this Id", 404))
    }

    deleteTask = await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Task deleted successfully" })
}))


app.listen(3000, () => {
    console.log("Listeing on Port 3000!!")
})
