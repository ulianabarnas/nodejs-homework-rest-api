const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const msg = {
    ...data,
    from: "ulianabarnas9225@gmail.com",
  };
  // eslint-disable-next-line no-useless-catch
  try {
    console.log("TRY SEND");
    await sgMail.send(msg);
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
