import { auth,createUserWithEmailAndPassword,validatePassword,collection,db,doc,setDoc,updateProfile } from '../firebase.js'; 
// import { Notyf } from 'https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.es.js';

const notyf = new Notyf({
  duration: 4000,
  position: { x: 'right', y: 'bottom' }
})

let signupBtn=document.getElementById("signup");

let saveUserToDb=async(name,Email,user)=>{
    try{   
     await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: Email,
            createdAt: new Date()
            });
    console.log("saved to DB");
    return true


    }catch{
       console.log("not saved to DB");
       location.href=location;
       return false
       
    }
}


let registerUser=async (e)=>{
    e.preventDefault();
    let password=document.getElementById("password").value;
    let email=document.getElementById("email").value;
    let nameUser=document.getElementById("name").value;


    if(email && password){
         createUserWithEmailAndPassword(auth, email, password)
        .then( async(userCredential) => {
            const user = userCredential.user;
            user.displayName=nameUser;
            console.log(`user-->${user}`);

            await updateProfile(user, {
                displayName: nameUser
            });

           const saved = await saveUserToDb(nameUser, email,user);

           
           if(saved){
                notyf.success("User Register");
                document.getElementById("password").value="";
                document.getElementById("email").value="";
                document.getElementById("name").value="";

               setTimeout(() => {
                   location.href="./login.html"; 
               }, 1000);

           }else{
               await user.delete().then(() => {
                    console.log("User deleted.");
                   alert("Failed to save user data. Registration canceled.");
                })
                .catch((error) => {
                    alert("Failed to delete user",error);
                });
                document.getElementById("password").value="";
                document.getElementById("email").value="";
                document.getElementById("name").value="";
                return
           }

            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

             if (error.code === 'auth/email-already-in-use') {
                notyf.error("This email is already registered.");
                setTimeout(() => {
                    location.href="./login.html"
                }, 1000);
                return
            } else if (error.code === 'auth/invalid-email') {
                notyf.error("Please enter a valid email address.");
                document.getElementById("email").value = "";
                return
            } else if (error.code === 'auth/weak-password') {
                notyf.error("Password should be at least 6 characters.");
                document.getElementById("password").value = "";
                return
            } else {
                notyf.error("An error occurred. Please try again.");
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                document.getElementById("name").value = "";
            }
            
            console.log(errorMessage,errorCode);
            
        });
    }else{
        notyf.error("fill out the field");
    }
}
signupBtn.addEventListener("click",registerUser);