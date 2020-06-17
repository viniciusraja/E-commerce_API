const multer=require('multer')
const path=require('path')
const crypto=require('crypto')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storageTypes = {
      local: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
        },
        filename: (req, file, cb) => {
            const fileName = req.path.split('/', 2)[1]
            const fileType = file.mimetype.split('/', 2)[1]
            console.log(fileName)
            cb(null, `${fileName}-${req.params.id}.${fileType}`);
        }
      }),
      cloudinary : new CloudinaryStorage({
          cloudinary: cloudinary,
          params: async (req, file) => {
                
            const fileName = req.path.split('/', 2)[1]
            const fileType = file.mimetype.split('/', 2)[1]
            
            return{
              folder: 'Products',
              public_id:`${fileName}-${req.params.id}.${fileType}`
            }
          },
        
    })

    };
    
    module.exports = { 
      dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
      storage: storageTypes[process.env.STORAGE_TYPE],
      limits: {
        fileSize: 2 * 1024 * 1024
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          "image/jpeg",
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
    
    


