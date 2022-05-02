
  
const  axios  = require('axios');
async function getIpClient() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error(error);
  }
}

module.exports =  getIpClient;