const nodemailer = require('nodemailer');

const sendEmail = async (receiverEmail, fileID, senderName = "MyEncrypt") => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,  
            pass: process.env.GMAIL_PASS  
        }
    });

    const mailOptions = {
        from: `"${senderName}" <${process.env.GMAIL_USER}>`,
        to: receiverEmail,
        subject: "Here is your File ID!",
        text: `Dear user, here is your File ID: ${fileID}`,
        html: `<h3>Dear user,</h3><br/>Download page: <a href='http://localhost:3000/download'>download page link</a><br/>Here is your File ID: <strong>${fileID}</strong><br/><br/><b>Because of our security policy we don't share passwords. You need to ask the sender for it.</b>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, data: info.response };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = sendEmail;
