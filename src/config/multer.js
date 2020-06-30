const multer=require('multer')
const path=require('path')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storageTypes = {
      local: multer.diskStorage({
        destination: (req, file, cb) => {
          ('Req in multer')
          cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
        },
        filename: (req, file, cb) => {
          (file,'Req in multer')
            const fileName = req.path.split('/', 2)[1]
            const fileType = file.mimetype.split('/', 2)[1]
            cb(null, `${fileName}-${req.params.id}.${fileType}`);
        }
      }),
      cloudinary : new CloudinaryStorage({
          cloudinary: cloudinary,
          params: async (req, file) => {
            return{
              folder: 'Products',
              public_id:`${req.params.id}`
            }
          },
        
    })

    };
    
    module.exports = { 
      dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
      storage: storageTypes[process.env.STORAGE_TYPE],
      limits: {
        fileSize:1024 * 1024
      },
      fileFilter: (req, file, cb) => {
        ('multer', file)
        const allowedMimes = [
          "image/jpeg",
          "image/jpg",
          "image/pjpeg",
          "image/png",
          "image/gif"
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type."));
        }
        
      }
    };
    
    


