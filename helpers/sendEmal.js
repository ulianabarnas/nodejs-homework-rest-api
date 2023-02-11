const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;

const sendEmail = async (data) => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    ...data,
    from: "ulianabarnas9225@gmail.com",
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;
