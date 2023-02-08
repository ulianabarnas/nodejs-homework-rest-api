const Jimp = require("jimp");

const resizeAvatar = async (req, res, next) => {
  const { path } = req.file;

  const avatar = await Jimp.read(path);
  const resizingAvatar = avatar.resize(250, 250);

  await resizingAvatar.writeAsync(path);

  next();
};

module.exports = resizeAvatar;
