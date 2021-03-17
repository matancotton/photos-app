// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAFbngfZk_5yOSqPmoExLnMlbHturZCdAI",
    authDomain: "photos-api-db723.firebaseapp.com",
    databaseURL: "https://photos-api-db723-default-rtdb.firebaseio.com",
    projectId: "photos-api-db723",
    storageBucket: "photos-api-db723.appspot.com",
    messagingSenderId: "835911733919",
    appId: "1:835911733919:web:4c89f8441cd9a22e2b48aa",
    measurementId: "G-8XX2B88K8P",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const database = firebase.database();

database.ref("photos").on("value", (snapshot) => {
    const photos = [];
    snapshot.forEach((childSnapshot) => {
        photos.push(childSnapshot.val().name);
    });

    renderPhotos(photos);
});

const renderPhotos = (photos) => {
    const photosDiv = document.getElementById("photos");

    while (photosDiv.childNodes.length > 0) {
        photosDiv.removeChild(photosDiv.childNodes[0]);
    }
    photos.forEach((photo) => {
        const childPhoto = document.createElement("img");
        childPhoto.src = "/images/" + photo;
        photosDiv.appendChild(childPhoto);
    });
};

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const image = document.getElementById("image");
    if (!!image) {
        const formdata = new FormData();
        formdata.append("upload", image.files[0]);
        fetch("/upload", {
            method: "POST",
            mode: "cors",
            body: formdata,
        })
            .then((result) => {
                if (result.ok) return result.json();
                else throw new Error(res.status);
            })
            .then((resObj) => {
                database.ref("photos").push({
                    name: resObj.imageName,
                });
            })
            .catch((err) => {
                alert(err.message);
            });
    }
});
