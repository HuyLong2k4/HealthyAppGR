require('dotenv').config();
const express  = require('express');
const morgan   = require('morgan');
const connectDB = require('./config/db/index');
const userRoutes = require('./app/routes/userRoutes');
const courseRoutes = require('./app/routes/courseRoutes');
const lessonRoutes = require('./app/routes/lessonRoutes');
const commentRoutes = require('./app/routes/commentRoutes');
const medicalHistoryRoutes = require('./app/routes/medicalHistoryRoutes');
const medicalConditionRoutes = require('./app/routes/medicalConditionRoutes');
const healthIndexRoutes = require('./app/routes/healthIndexRoutes');
const healthInfoRoutes = require('./app/routes/healthInformationRoutes');
const authRoutes = require('./app/routes/authRoutes');
const deviceRoutes = require('./app/routes/deviceRoutes');
const enrollmentRoutes = require('./app/routes/enrollmentRoutes');
const dailyGoalRoutes = require('./app/routes/dailyGoalRoutes');
const doctorRoutes = require('./app/routes/doctorRoutes');
const appointmentRoutes = require('./app/routes/appointmentRoutes');
const messageRoutes = require('./app/routes/messageRoutes');
const notificationRoutes = require('./app/routes/notificationRoutes');
const debugRoutes = require('./app/routes/debugRoutes');

connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;


app.use(morgan('combined'));
app.use(express.json());

app.get('/', (_, res) => res.send('Hello World!'));

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/comments', commentRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/medical-histories', medicalHistoryRoutes);
app.use('/api/medical-conditions', medicalConditionRoutes);
app.use('/api/health-indices', healthIndexRoutes);
app.use('/api/health-information', healthInfoRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/daily-goals', dailyGoalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Debug routes (Admin only)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/debug', debugRoutes);
  console.log('⚠️ Debug routes enabled at /api/debug');
}

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server listening on http://192.168.1.5:${PORT}`)
);
