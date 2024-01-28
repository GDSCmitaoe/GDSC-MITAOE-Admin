const Team = require('../models/Teams');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./public/images/teams');
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.split(".")[1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + ext;
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

const upload = multer({ storage: storage }).single('memberImage')


exports.createTeam = async (req,res) =>{
    try {
        upload(req,res, async (err)=>{
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                console.log(err.message);
                return res.json({
                  success:false,
                  message:err.message
                })
              } else if (err) {
                // An unknown error occurred when uploading.
                console.log("hey");
                console.log(err); 
                return res.json({
                  success:false,
                  message:err.message
                })
              } else{
              let social = {
                instagram:req.body.instagram,
                linkedin:req.body.linkedin,
                twitter:req.body.twitter,
                facebook:"",
                github:req.body.github, 
                link:req.body.link
              }
              let team = await Team.create({ 
                name:req.body.name,
                img:req.file.filename,
                designation:req.body.designation,
                desc:req.body.desc,
                year:req.body.year,
                position:1,
                social:social
              })
            // res.json({
            //     success:true,
            //     message:"Member Created",
            //     team
            // })
            res.redirect('/editTeams')
          }
        });
    } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.updateMember = async (req,res)=>{
  try {
    // console.log(req.body);
    let member = await Team.findOneAndUpdate({_id:req.params.id},req.body);
    member = await Team.find({_id:req.params.id})
    // res.json({
    //   success:true,
    //   member
    // })
    res.redirect('/editTeams')
  } catch (err) {
    res.json({
      success:false,
      message:err.message
    })
  }
}
// public api
exports.getTeams = async (req,res) =>{
    try {
        let date = new Date();
        let current_year = date.getFullYear();
        // console.log(date.getMonth());
     
        if(date.getMonth() < 6){  // till June 
          current_year--;
        }
        let currentYearTeam = await Team.find({
            year:current_year
        }).sort('position');
        let pastTeams = await Team.find({year:{$ne:current_year}}).sort({year:'desc'}).sort('position');
        let years = [];
        let y = current_year;
        while(y != 2022){
          y--;
          years.push(y);
        }

        res.json({
            success:true,
            years,
            currentYearTeam,
            pastTeams,
            current_year
        })
    } catch (err) {
        res.status(500).json({
            success:false, 
            message:err.message
        })
    }
}

exports.getOneMember = async (req,res) =>{
  try {
    let member = await Team.find({_id:req.params.id});
    res.json({
      success:true,
      member
    })
  } catch (err) {
    res.json({
      success:false,
      message:err.message
    })
  }
}

exports.deletMember = async (req,res) =>{
  try {
    let member = await Team.findOneAndDelete({_id:req.params.id})
    // res.json({
    //   success:true,
    //   message:"Member Deleted Successfully"
    // })
    res.redirect('/editTeams')
  } catch (err) {
    res.json({
      success:false,
      message:err.message
    })
  }
}