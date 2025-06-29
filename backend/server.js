const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.json()); 

const mockResponse = {
  status: "success",
  timestamp: new Date().toISOString(),
  data: {
    "status": "success",
    "timestamp": "2025-05-23T10:00:00Z",
    "data":{
      "data": {
      
        "posts": [
          {
            "id": "post1",
            "title": "How to Learn React Fast",
            "author": "Alice Smith",
            "published": true,
            "tags": ["React", "JavaScript", "WebDev"],
            "createdBy":{name:"AB" , id:"1"},
            "createdAt": "2025-05-20T10:00:00Z"
          },
          {
            "id": "post2",
            "title": "Intro to 3D Web with Three.js",
            "author": "Bob Johnson",
            "published": false,
            "tags": ["Three.js", "3D", "Graphics"],
                        "createdBy":{name:"xy" , id:"2"},
            "createdAt": "2025-05-21T12:30:00Z"
          },
           {
            "id": "post3",
            "title": "Intro to 3D Web with Three.js",
            "author": "KJ",
            "published": false,
            "tags": ["Three.js", "3D", "Graphics"],
                        "createdBy":{name:"xy" , id:"2"},
            "createdAt": "2025-05-21T12:30:00Z"
          }
       
        ]
      }
    }

  }
  
};

app.get('/api/mock', (req, res) => {
  res.json(mockResponse);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Mock API server is running at http://localhost:${PORT}`);
});
