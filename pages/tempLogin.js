// for login function

firebase.analytics();
const firebaseEmailAuth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

$(()=>{
    handleSignIn();
    handleSignUp();
    handleGoogle();
});

// <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
// <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
// <input type="text" class="form-control" id="inputName3" placeholder="Nick name">
// <input type="text" class="form-control" id="inputNum3" placeholder="Phone number without hipen(-)">
// <button type="button" class="btn btn-info login">Sign in</button>
// <button type="button" class="btn btn-info sign-up">Sign up</button>
// <button type="button" class="btn btn-info google">With Google</button>
// <button type="button" class="btn btn-default float-right close">Cancel</button>

const DocRef = db.collection('users');

// let email = $('#inputEmail3').val();
// let password = $('#inputPassword3').val();
// let name = $('#inputName3').val();
// let phoneNum = $('#inputNum3').val();

function handleSignIn(){
    $(document).on('click', '.login', ()=>{

        let email = $('#inputEmail3').val();
        let password = $('#inputPassword3').val();
        let name = $('#inputName3').val();
        let phoneNum = $('#inputNum3').val();

        console.log(email, password);

        firebaseEmailAuth.signInWithEmailAndPassword(email, password)
            // sign-in success
            .then(()=>{
                let user_uid = firebaseEmailAuth.currentUser.uid;

                if(user_uid){
                    alert("login success : " + user_uid);
                    window.location.replace("../pages/menu.html")
                }
            })
            .catch((error)=>{
                alert("error : " + error);
                location.reload();
            });
    });
}

function handleSignUp(){
    $(document).on('click', '.sign-up', ()=>{

        let email = $('#inputEmail3').val();
        let password = $('#inputPassword3').val();
        let name = $('#inputName3').val();
        let phoneNum = $('#inputNum3').val();

        if(checkValidate(name, email, password, phoneNum)){
            createAccount(name, email, password, phoneNum, "", "user");
        }
        else {
            alert("sign-up is not valid");
        }
    });
}

function handleGoogle(){
    $(document).on('click', '.google', ()=>{

        firebaseEmailAuth.signInWithPopup(provider)
            .then((result)=>{
                let token = result.credential.accessToken;
                let user = result.user;
                let userDocRef = DocRef.doc(user['uid']);

                console.log(user);
                console.log(user['uid'], user['displayName'], user['photoURL'],
                    user['email'], user['phoneNumber']);

                userDocRef.get()
                    .then((doc)=>{
                        // 이미 Auth가 있다면...
                        if(doc.exists){
                            window.location.replace("../pages/menu.html");
                        }
                        else {
                            createUserDoc(user['uid'], user['displayName'], user['email'],
                                user['phoneNumber'], user['photoURL'], "user");
                        }
                    })
                    .catch((error)=>{
                        alert("error : " + error);
                    });
            })
            .catch((error)=>{
                alert("error : " + error);
            });
    });
}

function checkValidate(user_name, user_email, user_password, user_phoneNum) {
    let flag = true;

    if (user_email.length < 4) {
        alert('Please enter an email address.');
        flag = false;
    }
    if (user_password.length < 4) {
        alert('Please enter a password.');
        flag = false;
    }
    if (user_name.length < 4) {
        alert('Please enter a Name at least 4 character.');
        flag = false;
    }
    if (user_phoneNum.length < 4) {
        alert('Please enter a phone number.');
        flag = false;
    }
    return flag;
}

//  google : gmail, gpwd, g user name, g phone number
function createAccount(user_name, user_email, user_password, user_num, user_photo, user_perm) {
    console.log("createAccount");

    firebaseEmailAuth.createUserWithEmailAndPassword(user_email, user_password)
        .then(()=>{
            const user_uid = firebaseEmailAuth.currentUser.uid;
            console.log(user_uid);
            alert("auth created");

            createUserDoc(user_uid, user_name, user_email, user_num, user_photo, user_perm);
        })
        .catch((error)=>{
            alert("error : " + error);
        });
}

function createUserDoc(user_uid, user_name, user_email, user_num, user_photo, user_perm) {
    const userDocRef = DocRef.doc(user_uid);

    userDocRef.set({
        displayName: user_name,
        email: user_email,
        phoneNumber: user_num,
        photoUrl: user_photo,
        permission: user_perm
    });

    let summaryLog = user_email + ", "
        + user_uid + ", "
        + "user";
    console.log("log : " + summaryLog);
    alert("doc created");
}

// firebaseEmailAuth.signInWithPopup(provider)
//     .then((result)=>{
//         // google access token, google api 접근 지원
//         let token = result.credential.accessToken;
//         // sign-in user info
//         let user = result.user;
//
//         console.log("login success: ", user);
//
//         // signed-in, user exist
//         if(user) {
//             // replace는 현재 페이지를 해당 페이지로 교체해준다.
//             // 뒤로가기 등을 할 때 로그인 페이지는
//             // 건너뛰고 싶으므로 이렇게 하면 좋을듯.
//             window.location.replace("../pages/menu.html")
//         }
//         else {
//             alert("user is not exist");
//         }
//     })
//     .catch((error)=>{
//         alert("login failed: " + error);
//     });