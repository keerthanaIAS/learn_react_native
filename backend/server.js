
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

// Temporary OTP storage
const otpStorage = new Map();

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

// Send OTP
app.post('/send-otp', (req, res) => {
    const { mobile } = req.body;

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({
            success: false,
            message: 'Enter a valid 10-digit mobile number'
        });
    }

    // Generate random 6-digit OTP
    const otp = String(
        Math.floor(100000 + Math.random() * 900000)
    );

    // Store OTP with expiry
    otpStorage.set(mobile, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        createdAt: Date.now(),
        attempts: 0
    });

    console.log(`Demo OTP for ${mobile}: ${otp}`);

    res.json({
        success: true,
        message: 'Demo OTP generated successfully',
        demoOtp: otp,
        expiresIn: 300
    });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Mobile number and OTP are required'
        });
    }

    const savedOtp = otpStorage.get(mobile);

    if (!savedOtp) {
        return res.status(400).json({
            success: false,
            message: 'Please generate OTP first'
        });
    }

    if (Date.now() > savedOtp.expiresAt) {
        otpStorage.delete(mobile);

        return res.status(400).json({
            success: false,
            message: 'OTP expired. Please request a new OTP'
        });
    }

    if (savedOtp.attempts >= 5) {
        otpStorage.delete(mobile);

        return res.status(429).json({
            success: false,
            message: 'Too many incorrect attempts. Request a new OTP'
        });
    }

    if (String(otp) !== savedOtp.otp) {
        savedOtp.attempts++;

        return res.status(400).json({
            success: false,
            message: 'Incorrect OTP',
            attemptsRemaining: 5 - savedOtp.attempts
        });
    }

    // OTP successfully verified
    otpStorage.delete(mobile);

    res.json({
        success: true,
        verified: true,
        message: 'Mobile number verified successfully!'
    });
});

// Resend OTP
app.post('/resend-otp', (req, res) => {
    const { mobile } = req.body;

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid mobile number'
        });
    }

    const savedOtp = otpStorage.get(mobile);

    if (savedOtp && Date.now() - (savedOtp.createdAt || 0) < 60000) {
        return res.status(429).json({
            success: false,
            message: 'Please wait before requesting another OTP'
        });
    }

    const otp = String(
        Math.floor(100000 + Math.random() * 900000)
    );

    otpStorage.set(mobile, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        createdAt: Date.now(),
        attempts: 0
    });

    console.log(`New demo OTP for ${mobile}: ${otp}`);

    res.json({
        success: true,
        message: 'New demo OTP generated',
        demoOtp: otp,
        expiresIn: 300
    });
});

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at ${PORT}`);
});
