// This file is required by the menu.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// Your web app's Firebase configuration
// 로그인
var firebaseConfig = {
    apiKey: "AIzaSyBn-IuwPO6-dEhqB76u0VPZdJN1tZr3CYk",
    authDomain: "electron-admin-hwang.firebaseapp.com",
    databaseURL: "https://electron-admin-hwang.firebaseio.com",
    projectId: "electron-admin-hwang",
    storageBucket: "electron-admin-hwang.appspot.com",
    messagingSenderId: "974000776836",
    appId: "1:974000776836:web:148fd99efa15292da644d1",
    measurementId: "G-XDEB2YW10X"
};
// Initialize Firebase
// 앱에서 firebase를 초기화하려면 앱의 firebase 프로젝트 구성을 제공해야 한다.
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let firebaseEmailAuth = firebase.auth();
var db = firebase.firestore();

// init jquery
window.jQuery || document.write(decodeURIComponent('%3Cscript src="js/jquery.min.js"%3E%3C/script%3E'));

// jQuery의 즉시실행함수 IIFE
// 한 번의 실행만 필요로 하는 초기화 코드 부분에 많이 사용된다.
// 이는 변수를 전역으로 선언하는 것을 피하기 위해 사용한다.
// 코드의 충돌없이 편하게 구현할 수 있다.
$(function () {
    init();
// 로그인
    firebaseEmailAuth.onAuthStateChanged((user)=>{
        if(user){
            // initStarterPage();
            initUsersPage();
        }
    });
});

// 이벤트가 일어나면 새로고침이 한 번 일어난다.
function init() {
    // id가 'a'인 element를 클릭했을 때 이벤트 걸기
    // sidemenu를 가면 확인할 수 있다. <a>
    // a 태그는 하이퍼링크 등을 지원하는데
    // 그 클릭 이벤트를 오버라이딩한 것.
    $(document).on('click', 'a', function () {
        // 현재 이 element에 href의 값을 addressValue에게 준다.
        var addressValue = $(this).attr("href");
        // 'pages/'까지 잘 불러와졌다면...
        // if (addressValue.indexOf('pages/') > -1) {
        if (addressValue === '#') {
            return true;
            // 처음 app이 시작될 때는 여기로 온다.
        } else if (addressValue) {
            // .content-wrapper 클래스를 갖고 있는 element를 모두 select하는 selector이다.
            // .content-wrapper인 element에게 url을 넘겨주고, 서버와 통신 후 function이 실행된다.

            // load는 부분적으로 동적으로 바꿔준다. 그러므로 $(function())이 클릭할 때 다시 일어나지 않는다.
            $('.content-wrapper').load(addressValue, function () {
                // 자기 아래의 첫번째 자식을 지정하여, 그 자식의 부모 요소를 제거한다.
                // 아마 ajax로 갔다가 돌아오면 태그가 붙어오는 모양.
                $(this).children(':first').unwrap();
            });
            return false;
        }
        return false;
    })
}

function initStarterPage() {
    // init
    // starter.html을 가져와 .content-wrapper인 요소 안에 넣는다. 그 후 function을 취한다.
    $('.content-wrapper').load('starter.html', function () {
        $(this).children(':first').unwrap();
    });
}

function initUsersPage() {
    // init
    // starter.html을 가져와 .content-wrapper인 요소 안에 넣는다. 그 후 function을 취한다.
    $('.content-wrapper').load('users.html', function () {
        $(this).children(':first').unwrap();
    });
}

// Firestore에 collectionName을 store한다.
function storeFirestore(collectionName) {
    // firestroe의 collectionName을 가져온다.
    let dbCollection = db.collection(collectionName)
    let store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {  // 값 변경시 마다 load 실행됨.
            let deferred = $.Deferred();
            // dbCollection에 있는 모든 문서 가져오기
            let once = dbCollection.get().then((querySnapshot) => {
                console.log("qSS: " + querySnapshot.docs)
                let arr = []
                // querySnapshot은 query의 결과들을 갖고 있다.
                querySnapshot.docs.forEach(function (doc) {
                    let data = doc.data()
                    data.id = doc.id
                    arr.push(data)
                })
                // ES6: 처리 성공 상태 부여
                // Deferred 객체의 state를 resolve로 변경
                deferred.resolve(arr)
            });
            //promise로 Deferred 객체가 가지고 있는 promise 객체 반환
            // 반환된 객체는 resolve(), reject()를 사용할 수 없어
            // 비동기 처리 상태가 보장된다.
            return deferred.promise();
        },
        insert: function (values) {
            dbCollection.doc().set(values)
        },
        update: function (key, values) {
            dbCollection.doc(key).set(values, {merge: true});
        },
        remove: function (key) {
            dbCollection.doc(key).delete()
        }
    });
        // DB 데이터 실시간 업데이트
        let query = dbCollection
            .onSnapshot(querySnapshot => {
                querySnapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        console.log('query New: ', change.doc.data());
                        let data = change.doc.data()
                        data.id = change.doc.id
                        store.push([{ type: "insert", data: data, index: change.doc.id}]);
                    }
                    if (change.type === 'modified') {
                        console.log('query Modified: ', change.doc.data());
                        store.push([{ type: "update", data: change.doc.data(), key: change.doc.id }]);
                    }
                    if (change.type === 'removed') {
                        console.log('query Removed: ', change.doc.data());
                        store.push([{ type: "remove", key: change.doc.id }]);
                    }
            });
        });
    return store
}
