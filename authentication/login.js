import {auth ,signInWithEmailAndPassword,onAuthStateChanged } from '../firebase.js'; 

let signInBtn=document.getElementById("signInBtn");

const notyf = new Notyf({
  duration: 4000,
  position: { x: 'right', y: 'bottom' }
})



let loginUser=(e)=>{
    e.preventDefault();
    let email=document.getElementById("email").value;
    let password=document.getElementById("password").value;
    
    if (password.length<6){
        notyf.error("password atleast contains 6 letters ")
        password="";
        return
    }

 if(email!="" && password!=""){   
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log(`user-->${user}`);
        email="";
        password="";
        notyf.success("LogIn Successfully");
        setTimeout(() => {
           location.href="../index.html"; 
        }, 1000);
    })
    
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
      
        if (error.code === 'auth/invalid-email') {
            notyf.error("Please enter a valid email address.");
            email="";
            return
        }else if(error.code=="auth/invalid-credential"){
            notyf.error("You don't have an account...");
            setTimeout(() => {
                location.href="./signup.html"
            }, 1000);
            return
        }
        })

        password="";
        email="";
    
    }
    };


 signInBtn.addEventListener("click",loginUser);

// export let checkUser=(user)=>{
//    if (user){
//        notyf.success("LogIn Successfully");
//        setTimeout(() => {
//            location.href="../index.html"; 
//        }, 1000);
//    }

// }
// onAuthStateChanged(auth,checkUser);
