const axios = require('axios');
axios.post('https://autocon-server.onrender.com/api/ai/search', {
    query: "heavy belt conveyor",
    language: "en-US"
}).then(res => console.log("SUCCESS:", res.data))
  .catch(err => console.log("ERROR:", err.response ? err.response.data : err.message));
