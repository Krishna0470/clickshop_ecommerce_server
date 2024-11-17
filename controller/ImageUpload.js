const cloudinary = require("cloudinary")


cloudinary.config({
    cloud_name:"dhbtsag0o",
    api_key:"195452784524185",
    api_secret:"bOunDv4X-EeKKjDYlXGqNXM3MaA"
})
const imageUploadController = async (req,res) =>{
    try{
        const result = await cloudinary.uploader.upload(req.files.image.path)
        res.json({
            url:result.secure_url,
            public_id:result.public_id,
        })
    }catch(error){
        console.log(error);
    }
}
module.exports =  imageUploadController