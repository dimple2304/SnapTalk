import ImageKit from "imagekit";
import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT } from "../config/envIndex.js";
import { BadRequestError } from "./customErrorHandler/customError.js";

export const imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

// controller service for imagekit file upload
export const uploadFile = async (req, res, next) => {
    try {
        let { filename, folder } = req.body;

        if (req.file) {
            const result = await imagekit.upload({
                file: req.file.buffer.toString("base64"),
                fileName: `${req.user.id + filename}`,
                folder: "SnapTalk/" + folder
            })
            
            return res.status(200).json({ success: true, fileUrl: result.url, fileId: result.fileId });
        }
        throw new BadRequestError("File is required.");
    } catch (err) {
        next(err);
    }
}


// get file id (file name)
// export const getFileId = function(url){
//     const fileId = url.slice(url.lastIndexOf('/')+1,url.length)
//     console.log(fileId);
    
//     return fileId.trim();
// }
