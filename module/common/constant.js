
//MODEL STATUS
const STATUS = {
  PAID:'PAID',
  ORDERED:'ORDERED',
  ORDER:'ORDER',
  CANCEL:'CANCEL',
  PAYED: 'PAYED',
  COMPLETED:'COMPLETED',
  PAID_RECIVE:'PAID_RECIVE',
  SHIPPING:'SHIPPING'
}

const SKIN_TYPE={
  OD:'DA DẦU & DA KHÔ (O - D)',
  SR:'DA NHẠY CẢM & DA KHỎE (S - R)',
  PN:'NHIỄM SẮC TỐ & KHÔNG NHIỄM SẮC TỐ (P - N)',
  WT:'NHĂN & CĂNG (W - T)'
}

//Response message
const MESSAGE = {
  NOTFOUND: 'Not found ',
  INVALIDPARAM: 'Invalid param '
}
const serverPath = 'public/'
const tempPath = 'images/temp/'
const contributePath = 'images/contribute/'
const ogPath = 'images/og/'
const path200 = 'images/200/'
const pathAvatar = 'images/avatar/'
const pathPost = 'images/post/'



// ROLEs
const CUSTOMER='customer'
const DOCTOR='doctor'
const ADMIN='admin'
module.exports = {STATUS, MESSAGE, tempPath, ogPath, path200, serverPath, contributePath, pathAvatar,SKIN_TYPE,pathPost,CUSTOMER,DOCTOR,ADMIN}