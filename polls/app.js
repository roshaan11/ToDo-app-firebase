import {
  collection,
  auth,
  onAuthStateChanged,
  signOut,
  db,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  onSnapshot,
  where,
  getDocs,
  updateDoc
} from "../firebase.js";
// import moment from 'moment';

const notyf = new Notyf({
  duration: 4000,
  position: { x: "right", y: "bottom" },
});

let addToDo = document.getElementById("addtodo");
let listToDo = document.getElementById("list");
let logOut = document.getElementById("logout");
let mainName = document.getElementById("name-main");
// let editContent=document.getElementById("editcontent");
// let editValue=document.getElementById("editinput");
// let editUpdate=document.getElementById("editupdate");

let savingToDos = [];
let completeToDoCount=0;
// if user logout automatically goes to login otherwise show name of user and todos 
let checkUser =async(user) => {
  console.log(user);

  if (!user) {
    location.href = "../authentication/login.html";
  } else {
    mainName.innerHTML = `${auth.currentUser.displayName}`.toUpperCase();
    try {
      listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
          <span class="px-2 text-md font-mono flex w-full justify-center ">loading >>>></span>
         </li>`
      
      CompletedTodo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
        <span class="px-2 text-md font-mono flex w-full justify-center ">loading complete todo's >>>>>></span>
      </li>`
      await getToDoData();
    } catch (error) {
      console.log(error);

    }
    if(savingToDos.length>0){
      CompletedTodo.innerHTML=""
      renderingToDo();
    }else{
      listToDo.innerHTML=""
      listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
           <span class="px-2 text-md font-mono flex w-full justify-center ">Add To Do's To Show </span>
          </li>`
    } 
  }
};

onAuthStateChanged(auth, checkUser);

//logout user
let logOutUser = () => {
  signOut(auth)
    .then(() => {
      notyf.success("Logout Successfully");
    })
    .catch((error) => {
      console.log(error);
      notyf.error("error");
    });
};
logOut.addEventListener("click", logOutUser);

//adding to-do to firebase 
let addingToDo = async (user) => {
  console.log(user);

  event.preventDefault();
  let addToDoInput = document.getElementById("input").value;
  let newContentValue = addToDoInput.trim();
  if (!newContentValue) {
    notyf.error("Please enter a task");
    return;
  }

  let toDoData = {
    content: newContentValue,
    status: false,
    timestamp: serverTimestamp(),
    userid: auth.currentUser.uid,
  };
  try {
    listToDo.innerHTML=""
    listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
          <span class="px-2 text-md font-mono flex w-full justify-center ">Adding >>>></span>
         </li>`
    const dbRef = collection(db, "toDoData");
    await addDoc(dbRef, toDoData);
   
    console.log("data stored:" + dbRef.id);

   

    
   try {
      listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
          <span class="px-2 text-md font-mono flex w-full justify-center ">Adding >>>></span>
         </li>`
     
      await getToDoData();
    } catch (error) {
      console.log(error);

    }

    if(savingToDos.length>0){
      CompletedTodo.innerHTML="";
     renderingToDo();
    }else{
      listToDo.innerHTML=""
      listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
           <span class="px-2 text-md font-mono flex w-full justify-center ">Add To Do's To Show </span>
          </li>`
    } 
  
    notyf.success("To-Do added sucessfully");


    document.getElementById("addtodo") = "";
    console.log(toDoData);
  } catch (e) {
    console.log(e + "error");
    // notyf.error("To-Do not added");
  // }
  
}};

addToDo.addEventListener("click", addingToDo);

// getting all to dos 
let getToDoData = async () => {
  try {
    const q = query(
      collection(db, "toDoData"),
      where("userid", "==", auth.currentUser.uid),
     orderBy("timestamp", "desc") 
);
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
     let item=doc.data();
     item.docId=doc.id;
   
    //  console.log(item);
      savingToDos.push(item);
     
    addToDo="";
    });
  } catch (error) {
    console.log(error);
    notyf.error("getting data error");
  }
};

// rendering all to dos
let CompletedTodo=document.getElementById("Completedtodo")
let statustodo;
let renderingToDo=()=>{
   listToDo.innerHTML="";
   CompletedTodo.innerHTML="";
   completeToDoCount = 0;
   console.log(savingToDos);

  let completedTodos = savingToDos.filter(todo => todo.status);

  if(completedTodos.length==0){
          CompletedTodo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
           <span class="px-2 text-md font-mono flex w-full justify-center ">Complete To Do's To Show </span>
          </li>`
          // CompletedTodo.innerHTML="";
        }

      savingToDos.forEach((item) => {
        const millis = (item.timestamp).seconds * 1000 + Math.floor(item.timestamp.nanoseconds / 1e6);
        const date = new Date(millis);
        const momentDate = moment(date);
        


        if(item.status==false){
          statustodo="Pending";
          listToDo.innerHTML += `
          <li id="listtodo" class="p-3 rounded-lg bg-white text-black shadow-md text-md font-medium">
            <div class="flex flex-col text-center sm:flex-row justify-between w-full>
              <p class="flex-1 text-sm text-gray-400">Created at:${momentDate.format(" h:mm A")}</p>
              <p class="w-8/12 sm:mt-0 mt-4 bg-yellow-100 text-black text-sm font-mono px-3 py-1 rounded shadow-sm border border-yellow-300">
              ${statustodo}
            </p>

            </div>

            <div class="flex w-full mt-4 justify-between gap-8">
              <div>
                <input type="checkbox" data-id="${item.docId}" class="check text-sm rounded-md border-gray-400 bg-white" >
                <span class="px-2 text-md font-bold">${item.content}</span>
              </div>
              <div class="flex gap-4">
              <i data-id="${item.docId}" class="edit fa-solid fa-pen-to-square text-lg text-green-800"></i>
              <i data-id="${item.docId}" class="delete fa-solid hover:shadow-md hover:text-red-600 fa-trash-can text-lg text-red-400"></i>
            </div>
            </div>
          </li>
             `;
        }else {
          statustodo="Completed";
           
          completeToDoCount++
           if(completedTodos.length==savingToDos.length){
             listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
            <span class="px-2 text-md font-mono flex w-full justify-center ">Add To Do's To Show </span>
           </li>`
         }
         console.log(completeToDoCount);
          CompletedTodo.innerhtml=" ";
          CompletedTodo.innerHTML+=`<li class="p-3 rounded-lg bg-white text-black shadow-md text-md font-medium">
            <div class="flex  flex-col text-center sm:flex-row justify-between w-full>
              <p class="flex-1  text-sm text-gray-400">Completed at:${momentDate.format(" h:mm A")}</p>
              <p class="w-8/12 sm:mt-0 mt-4 bg-green-100 text-black text-sm font-mono px-3 py-1 rounded shadow-sm border border-green-300">
              ${statustodo}
            </p>

            </div>

            <div class="flex w-full mt-4 justify-between gap-8">
              <div>
                <input type="checkbox" data-id="${item.docId}" class="check text-sm rounded-md border-gray-400 bg-white" checked >
                <span class="px-2 text-md font-bold">${item.content}</span>
              </div>
              <div class="flex gap-4">
              <i data-id="${item.docId}" class="edit fa-solid fa-pen-to-square text-lg text-green-800"></i>
              <i data-id="${item.docId}" class="delete fa-solid hover:shadow-md hover:text-red-600 fa-trash-can text-lg text-red-400"></i>
            </div>
            </div>
          </li>`
        }

      
      })
      savingToDos=[];
    
}

// accessing delete and edit buttons
let deleteToDo=async(id)=>{
  try {
     listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
          <span class="px-2 text-md font-mono flex w-full justify-center ">Deleting >>>></span>
         </li>`
    await deleteDoc(doc(db, "toDoData", id));

   try {
      await getToDoData();
    } catch (error) {
      console.log(error);
    }

    if(savingToDos.length>0){
      CompletedTodo.innerHTML=""
      renderingToDo();
    }else{
      listToDo.innerHTML=""
      listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
           <span class="px-2 text-md font-mono flex w-full justify-center ">Add To Do's To Show </span>
          </li>`
    } 
  
   
    notyf.success("To-Do deleted ")
  } catch (error) {
    console.log(error);
    notyf.error("something went wrong with delete ")
    
  }
  
}


let gettingCompleteTodo=async(id)=>{
  
  const docRef = doc(db, "toDoData", id);

  try {
  CompletedTodo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
        <span class="px-2 text-md font-mono flex w-full justify-center ">loading complete todo's >>>>>></span>
      </li>`

    await updateDoc(docRef, {
      status:true,
      timestamp:serverTimestamp()
    });

    notyf.success("To-Do Completed !!!")
  } catch (error) {
    console.log(error);
    
  }
  completeToDoCount++;
  await getToDoData();
  CompletedTodo.innerHTML=""
  renderingToDo();
  
}

let editPopup=async(id)=>{
  
  
  await getToDoData();
  document.getElementById("body").classList.toggle("bg-gray-400")
  document.getElementById("Complete").classList.toggle("bg-gray-400")
  document.getElementById("header").classList.toggle("bg-gray-400")
  document.getElementById("crud-modal").classList.remove("hidden");
  document.getElementById("crud-modal").classList.add("flex")

  let gettodo=savingToDos.find(item=>item.docId==id);
  

  document.getElementById("crud-modal").innerHTML=`<div class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 id="editcontent" class="text-lg font-semibold text-gray-900 dark:text-white">
                    Edit To-Do 
                </h3>
                <button type="button" id="cancel"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
           <form class="p-4 md:p-5">
                <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                        <label for="name"
                               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                        <input type="text" name="name" id="editinput"
                               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="Type To-Do content" value="${gettodo.content}">
                    </div>
                  </div>
                  <button type="button" data-id="${gettodo.docId}" id="editupdate" 
                              class="w-full text-white justify-center inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          Update 
                      </button>

            </form>
        </div>
    </div>`

}

let editToDo=async(id)=>{
  let getPrevValue=savingToDos.find(item=>item.docId=id);
  let value=document.getElementById("editinput").value;
  
  if(getPrevValue.content==value){
    notyf.error("You don't edit to do")
    return
  }
   const docRef = doc(db, "toDoData", id);

  document.getElementById("body").classList.toggle("bg-gray-400")
  document.getElementById("Complete").classList.toggle("bg-gray-400")
  document.getElementById("header").classList.toggle("bg-gray-400")
  document.getElementById("crud-modal").classList.add("hidden")
  document.getElementById("crud-modal").classList.remove("flex");

  try {
    listToDo.innerHTML="";
   listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
        <span class="px-2 text-md font-mono flex w-full justify-center ">loading todo's >>>>>></span>
      </li>`    
      savingToDos=[];

    await updateDoc(docRef, {
      content:value,
      timestamp:serverTimestamp()
    });

    notyf.success("To-Do Edit !!!")
  } catch (error) {
    console.log(error);
    notyf.error("to-do not edit ")
    
  }
  await getToDoData();
  CompletedTodo.innerHTML=""
  listToDo.innerHTML=""
  renderingToDo();

}
let cancel=()=>{
  document.getElementById("crud-modal").classList.add("hidden");
  document.getElementById("body").classList.toggle("bg-gray-400")
  document.getElementById("Complete").classList.toggle("bg-gray-400")
  document.getElementById("header").classList.toggle("bg-gray-400")
}


///acessing buttons
listToDo.addEventListener("click",(e)=>{
    if(e.target.matches(".delete")){
        let id = e.target.getAttribute("data-id");
        deleteToDo(id);
    }else if(e.target.matches(".edit")){
        let id=e.target.getAttribute("data-id");
        editPopup(id);
    }else if(e.target.matches(".check")){
        let id=e.target.getAttribute("data-id");
        gettingCompleteTodo(id);
    }

})

let inComplete=async(id)=>{
const docRef = doc(db, "toDoData", id);

  try {
  CompletedTodo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
        <span class="px-2 text-md font-mono flex w-full justify-center ">loading complete todo's >>>>>></span>
      </li>`
  listToDo.innerHTML=`<li class="p-3 bg-white text-gray-400 text-md font-medium">
        <span class="px-2 text-md font-mono flex w-full justify-center ">loading todo's >>>>>></span>
      </li>`    

    await updateDoc(docRef, {
      status:false,
      timestamp:serverTimestamp()
    });

    notyf.success("To-Do incomplete !!!")
  } catch (error) {
    console.log(error);
    
  }
  completeToDoCount--;
  await getToDoData();
  listToDo.innerHTML=""
  CompletedTodo.innerHTML=""
  renderingToDo();
  
}
CompletedTodo.addEventListener("click",(e)=>{
  if(e.target.matches(".check")){
        let id = e.target.getAttribute("data-id");
        inComplete(id);
}
})
document.getElementById("crud-modal").addEventListener("click",(e)=>{
  if(e.target.matches("#cancel")){
        cancel();
}
})

document.getElementById("crud-modal").addEventListener("click",(e)=>{
  if(e.target.matches("#editupdate")){
      let id = e.target.getAttribute("data-id");
        editToDo(id);
}
})

