
//create feature
function itemTemplate(item){
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-item="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-item="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}
//render page code
let ourHTML=items.map((item)=>{
    return itemTemplate(item)
}).join('')
document.getElementById('item-list').insertAdjacentHTML("beforeend",ourHTML)

let createFeild=document.getElementById('create-feild');
document.getElementById('data-form').addEventListener('submit',(e)=>{
   e.preventDefault()
   axios.post('/create-item',{text:createFeild.value})
   .then((response)=>{
           document.getElementById('item-list').insertAdjacentHTML("beforeend",itemTemplate(response.data )) 
           createFeild.value=""
           createFeild.focus()
        })
   .catch(()=>{
       alert("something is wrong")
   })
})


document.addEventListener("click",(e)=>{
    //delete feature
    if(e.target.classList.contains("delete-me")){
        if(confirm("do u really want")){
            axios.post('/delete-item',{id:e.target.getAttribute("data-item")})
            .then(()=>{
            e.target.parentElement.parentElement.remove()
            })
          .catch(()=>{
        alert("something is wrong")
         })  
        }
    }
   //updATE feature
    if(e.target.classList.contains("edit-me")){
   let userInput= prompt("enter a new text",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
  if(userInput){
    axios.post('/update-item',{text:userInput,id:e.target.getAttribute("data-item")})
    .then(()=>{
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML=userInput
    })
    .catch(()=>{
        alert("something is wrong")
    })
  }
    }
})