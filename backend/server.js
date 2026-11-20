
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

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

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Save as: timestamp_originalname
        cb(null, Date.now() + '_' + file.originalname);
    }
});
const upload = multer({ storage });

// Temporary in-memory push token storage: Map<mobile, Set<expoPushToken>>
const userPushTokens = new Map();

// Helper function to send push messages via Expo
async function sendExpoMessages(tokens, title, body, data = {}) {
    const messages = [];

    for (const token of tokens) {
        if (!Expo.isExpoPushToken(token)) {
            console.warn(`Invalid Expo push token skipped: ${token}`);
            continue;
        }
        messages.push({
            to: token,
            sound: 'default',
            title,
            body,
            data,
        });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error('Error sending push notification chunk:', error);
        }
    }

    return tickets;
}

// 1. REGISTER PUSH TOKEN (Call this right after /verify-otp succeeds)
app.post('/register-token', (req, res) => {
    const { mobile, expoPushToken } = req.body;

    if (!mobile || !expoPushToken) {
        return res.status(400).json({
            success: false,
            message: 'mobile and expoPushToken are required',
        });
    }

    if (!Expo.isExpoPushToken(expoPushToken)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Expo push token format',
        });
    }

    if (!userPushTokens.has(mobile)) {
        userPushTokens.set(mobile, new Set());
    }
    userPushTokens.get(mobile).add(expoPushToken);

    console.log(`Registered token for ${mobile}:`, expoPushToken);

    res.json({
        success: true,
        message: 'Push token registered successfully',
    });
});

// 2. SEND NOTIFICATION TO ALL LOGGED-IN USERS
app.post('/notify-all', async (req, res) => {
    const { title, body, data } = req.body;

    if (!title || !body) {
        return res.status(400).json({
            success: false,
            message: 'title and body are required',
        });
    }

    // Collect all unique tokens across all users
    const allTokens = new Set();
    for (const tokenSet of userPushTokens.values()) {
        for (const token of tokenSet) {
            allTokens.add(token);
        }
    }

    if (allTokens.size === 0) {
        return res.status(404).json({
            success: false,
            message: 'No registered devices found',
        });
    }

    const tickets = await sendExpoMessages([...allTokens], title, body, data);

    res.json({
        success: true,
        sentToCount: allTokens.size,
        tickets,
    });
});

// 3. SEND NOTIFICATION TO A SPECIFIC USER BY MOBILE NUMBER
app.post('/notify-user/:mobile', async (req, res) => {
    const { mobile } = req.params;
    const { title, body, data } = req.body;

    if (!title || !body) {
        return res.status(400).json({
            success: false,
            message: 'title and body are required',
        });
    }

    const tokenSet = userPushTokens.get(mobile);

    if (!tokenSet || tokenSet.size === 0) {
        return res.status(404).json({
            success: false,
            message: `No active devices found for mobile ${mobile}`,
        });
    }

    const tickets = await sendExpoMessages([...tokenSet], title, body, data);

    res.json({
        success: true,
        mobile,
        tickets,
    });
});

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

// 1. FILE DOWNLOAD ENDPOINT
app.get('/download-sample', (req, res) => {
    // Create a dummy text file to download
    const fileContent = "Hello! This is a sample file downloaded from your Node.js backend.";
    const filePath = path.join(__dirname, 'sample.txt');

    fs.writeFileSync(filePath, fileContent);
    res.download(filePath, 'student_sample.txt', (err) => {
        if (err) console.log(err);
        fs.unlinkSync(filePath); // Delete file after sending
    });
});

// 2. FILE UPLOAD ENDPOINT
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file received" });
        }
        console.log('File uploaded successfully:', req.file.filename);

        res.json({
            success: true,
            message: `File uploaded successfully! Saved as ${req.file.filename}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Upload failed" });
    }
});


const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at ${PORT}`);
});
