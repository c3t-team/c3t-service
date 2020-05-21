const Model = require("./model");

const create = async data => {
  const category = new Model(data);
  return await category.save();
};

const update = async (id, dataUpdate) => {
  return await Model.findByIdAndUpdate(id, dataUpdate, { new: true });
};

const deleteCategory = async id => {
  let result = await Model.findByIdAndUpdate(
    id,
    { deleted: true },
    { new: true, runValidators: true }
  );
  return result;
};

const getCategorys = async () => {
  let result = await Model.find({});
  let categorys = {};
  result.forEach(category => {
    categorys[category._id] = category;
  });

  return categorys;
};

const getCategoryById = async id => {
  const getCategory = () => Model.findById(id).lean();
  const getChildren = () => Model.find({ parent: id }).lean();
  const [category, children] = await Promise.all([
    getCategory(),
    getChildren()
  ]);
  category.children = children;
  return category;
};

const getCategoryByGroup = async () => {
  let result = await Model.find({ parent: null });
  console.log("hjhjas", result);
  let categorys = {};
  categorys = await Promise.all([getCategoryById(result[0]._id), getCategoryById(result[1]._id)]);
  return categorys;
};

const getnameCategoryParentAndSub =  async(id)=>{

  return await Model.findById(id).populate('parent', 'name');
}

module.exports = {
  create,
  update,
  deleteCategory,
  getCategorys,
  getCategoryById,
  getCategoryByGroup,
  getnameCategoryParentAndSub
};
