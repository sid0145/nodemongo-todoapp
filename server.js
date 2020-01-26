let express=require('express')
let mongodb=require('mongodb')
let sanitizeHTML=require('sanitize-html')
let myapp=express()
let db


let port=process.env.PORT
if(port==null||port==""){
  port=3000
}
let connectionString='mongodb+srv://todoAppuser:siddhesh@cluster0-xz4rb.mongodb.net/ToDoapp?retryWrites=true&w=majority'
mongodb.connect(connectionString,{useNewUrlParser:true,useUnifiedTopology: true},(err,client)=>{
  db=client.db()
  myapp.listen(port);
})
myapp.use(express.static('public'))
myapp.use(express.json())
myapp.use(express.urlencoded({extended:false}))

function passwordProtected(req,res,next){
  res.set('WWW-Authenticate','Basic realm="Sid-item-list"')
  console.log(req.headers.authorization)
  if(req.headers.authorization=="Basic c2lkOmphdmFzY3JpcHQ="){
    next()
  }
  else{
    res.status(401).send("authentication required")
  }

}
myapp.use(passwordProtected)
myapp.get('/',(req,res)=>{
  db.collection('items').find().toArray((err,items)=>{
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">Sid-item-list</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="data-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-feild" name="item" id="sid" autofocus autocomplete="off" required="" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
        </ul>
        
      </div>
      <script>
      let items=${JSON.stringify(items)}
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>`)    
  })
    
})
//for inserting new elements
myapp.post('/create-item',(req,res)=>{
   let safeText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttribute:{}})
  db.collection('items').insertOne({text:safeText},(err,info)=>{
    res.json(info.ops[0])
  })
 
 //for updating element 
})
myapp.post('/update-item',(req,res)=>{
  let safeText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttribute:{}})
 db.collection('items').findOneAndUpdate({_id:new mongodb.ObjectId(req.body.id)},{$set:{text:safeText}},()=>{
   res.send('success');
 }
)
})
//for deleting element
myapp.post('/delete-item',(req,res)=>{
  db.collection('items').deleteOne({_id:new mongodb.ObjectId(req.body.id)},()=>{
    res.send('success');
  }
 )
 })


