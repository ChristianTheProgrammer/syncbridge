const mongoose = require('mongoose');
const { SyncTask } = require('./models/syncTask');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

async function sendReminderEmail(task) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'user-email@gmail.com',
        subject: 'Task Reminder',
        text: `This is a reminder for your task: ${task.name}. It is due on ${task.dueDate}.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reminder email sent for task:', task.name);
    } catch (error) {
        console.error('Error sending reminder email:', error);
    }
}

async function checkDueTasks() {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tasks = await SyncTask.find({ dueDate: { $lte: tomorrow }, reminderSent: false });

        for (const task of tasks) {
            await sendReminderEmail(task);
            task.reminderSent = true;
            await task.save();
        }
    } catch (error) {
        console.error('Error checking due tasks:', error);
    } finally {
        mongoose.connection.close();
    }
}

mongoose.connect('mongodb://localhost:27017/syncbridge', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        checkDueTasks();
    })
    .catch(err => console.error('Failed to connect to MongoDB', err));
