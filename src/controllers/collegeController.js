const collagemodel = require("../models/collegeModel")
const internModel = require("../models/internModel")


const numberCheck=function(value){
  if(typeof value === 'number') return true
}
const isvalid=function(value){
  if(typeof value==='undefined' || value===null) return false
  if(typeof value !== 'string') return false
  if(typeof value === 'string' && value.trim().length===0) return false
  return true

}

let linkCheck=/(https?:\/\/.*\.(?:jpg|jpeg|png|gif))/i
let nameCheck = /^[a-zA-Z]+$/
let fullNameCheck =/^(?:([A-Za-z]+\-+[A-Za-z])|([A-Za-z])|([A-Za-z]+\ \1+[A-Za-z])|([([A-Za-z]+\, \1+[A-Za-z]))+$/

// ===============================[createCollage]=========================================
const createCollage  = async function (req, res) {
    try{
    const data=req.body

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Fill all the college requirement" })
    const {name,fullName,logoLink}=data
    // let name= name.toLowerCase()
 
    if(numberCheck(name) || numberCheck(fullName) || numberCheck(logoLink)){
      return res.status(400).send({status:false, msg:"Name, Fullname, LogoLink should not be number"})
    }
    
    if(!isvalid(name))return res.status(400).send({status:false, msg:"name is required"})
    if(!nameCheck.test(name))return res.status(400).send({status:false, msg:"don't use spaces, number and special character in name"})
    // =================================================================
    if(!isvalid(fullName)) return res.status(400).send({status:false, msg:"fullName is required"})
    if(!fullNameCheck.test(fullName))return res.status(400).send({status:false, msg:"dont use special chars in fullname"})
      // =====================================================
    if(!isvalid(logoLink)) return res.status(400).send({status:false, msg:"logoLink is required"})
    if(!linkCheck.test(logoLink)) return res.status(400).send({status:false, msg:"logoLink invalid"})

    //name unique test
      const dataCheck = await collagemodel.findOne({ name: name.toLowerCase()})
    if(dataCheck)return res.status(400).send({status:false, msg:"name is already exist"})

    const savedate=await collagemodel.create(data)
      return res.status(201).send({ status: true, msg: " college  created successfully", data: { name : savedate.name, fullName: savedate.fullName, logolink: savedate.logoLink, isDeleted: savedate.isDeleted} })

   }catch(err){
     return res.status(500).send({status:false, error:err.message})
   }
   }
// ===============================  [getCollageDetail]   ======================================
   const getCollageDetail  = async function (req, res) {
    try{
    const collegeName = req.query.collegeName
    if (!isvalid(collegeName)) return res.status(400).send({ status: false, msg: " please Enter college Name"})
      const savedata = await collagemodel.findOne({ name: collegeName.toLowerCase() })
    if(!savedata) return res.status(404).send({status:false, msg:`${collegeName} College Not found`})
      const { name, fullName, logoLink } = savedata

    let intern = []
    const internData = await internModel.find({collegeId: savedata._id})
    
    if(internData.length == 0)  {
      intern= "no interns"
    }
    else{
    internData.forEach(x => {
      let {_id, name, email, mobile} = x
      intern.push({ _id, name, email, mobile })
    })
  }
    let newObj = {name: name, fullName: fullName, logoLink: logoLink, interns: intern}

    return res.status(200).send({ status: true, data:  newObj})
    

   }catch(err){
     return res.status(500).send({status:false, error:err.message})
   }
   }


module.exports = {createCollage,getCollageDetail,numberCheck}