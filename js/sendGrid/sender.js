const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  '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'
);
const msg = {
  to: 'dipeshmadhavi1@gmail.com',
  from: 'madhavidipesh@gmail.com', // Use the email address or domain you verified above
  subject: 'Sending with Twilio SendGrid is Fun',
  html: `<div>
  <h2> This is the test mail
  </h2>
  </div>`,
};
(async () => {
  try {
    const result = await sgMail.send(msg);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
})();
