const Campaign = require('./model')

const findAll=async()=>{
  return await Campaign.find().lean()
}
const findOne = async (id) => {
  return await Campaign.findById(id).lean()
}
  
const create = async (data) => {
  const old_campaign = Campaign.findOne({name: data.name})
  if(old_campaign) throw new Error('Brand name already existed')
  const campaign = new Campaign(data)
  return await campaign.save()
}

const update = async (id, data) => {
  return await Campaign.findByIdAndUpdate(id, data, {new: true, runValidators: true})
}
module.exports={findAll,findOne,create,update}