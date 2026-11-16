
const express = require('express');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

// Temporary in-memory student data
let students = [
    {
        id: 1,
        name: 'Shiv',
        age: 31,
        course: 'React Native'
    },
    {
        id: 2,
        name: 'Vikram',
        age: 32,
        course: 'Node.js'
    },
    {
        id: 3,
        name: 'Vishnu',
        age: 30,
        course: 'React'
    },
];

// Home API
app.get('/', (req, res) => {
    res.send('Student Management Backend Running!');
});

// GET - All students
app.get('/students', (req, res) => {
    res.json(students);
});

// GET - Student by ID
app.get('/students/:id', (req, res) => {
    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    res.json(student);
});

// POST - Add student
app.post('/students', (req, res) => {
    const { name, age, course } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        !Number.isInteger(Number(age)) ||
        Number(age) <= 0 ||
        typeof course !== 'string' || !course.trim()
    ) {
        return res.status(400).json({
            message: 'Valid name, age and course are required'
        });
    }

    const newStudent = {
        id: Date.now(),
        name: name.trim(),
        age: Number(age),
        course: course.trim()
    };

    students.push(newStudent);

    res.status(201).json({
        message: 'Student added successfully',
        student: newStudent
    });
});

// PUT - Update student
app.put('/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const { name, age, course } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        !Number.isInteger(Number(age)) ||
        Number(age) <= 0 ||
        typeof course !== 'string' || !course.trim()
    ) {
        return res.status(400).json({
            message: 'Valid name, age and course are required'
        });
    }

    student.name = name.trim();
    student.age = Number(age);
    student.course = course.trim();

    res.json({
        message: 'Student updated successfully',
        student
    });
});

// DELETE - Remove student
app.delete('/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const studentIndex = students.findIndex(
        s => s.id === id
    );

    if (studentIndex === -1) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const deletedStudent = students.splice(studentIndex, 1)[0];

    res.json({
        message: 'Student deleted successfully',
        student: deletedStudent
    });
});

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at ${PORT}`);
});
