const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      const currentDate = new Date().toISOString().replace(/:/g, "-"); 
      const originalname = file.originalname;
      const filenameParts = originalname.split('.');
      const fileExtension = filenameParts.pop();
      const newFilename = `${filenameParts.join('.')}_${currentDate}.${fileExtension}`;
      cb(null, newFilename);
    },
  });
  
const upload = multer({ storage });
module.exports = upload