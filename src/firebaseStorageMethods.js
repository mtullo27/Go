import React, { useState } from "react";  
import { storage } from "./firebase/firebase";
import { deleteObject } from "firebase/storage";
  
  const allInputs = { imgUrl: "" };
  const [data, setData] = useState([]);
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  export function onShowAlert(type) {
    if (type === "success") {
      alert("File uploaded succesfully!");
      console.log(imageAsUrl.imgUrl);
    } else if (type === "mismatch") {
      alert(`Not an image, the image file is a ${imageAsFile.type} file`);
    } else if (type === "empty") {
      alert("Please select a file to upload");
    } else {
    }
  }

  //helper method for file upload
  export const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
    const [file] = e.target.files;
    if (file) {
      document.getElementById("uploadedImage").src = URL.createObjectURL(file);
    }
  };

  //function that allows user to select file to upload from local system to firebase
  export const handleFireBaseUpload = (e) => {
    e.preventDefault();
    console.log("start of upload");
    // async magic goes here...
    if (imageAsFile === "") {
      console.error(`no file selected`);
      onShowAlert("empty");
      return;
    }

    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);
    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(imageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
          })
          .then(onShowAlert("success"))
          .then((document.getElementById("uploadedImage").src = ""));
      }
    );
  };

  //clears any data stored in based on passed elementID
  export function clearBox(elementID) {
    var div = document.getElementById(elementID);
      
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
  }

  //list all of the items stored within the firebase storage object
  export const listItems = () => {
    clearBox("contentList");
    storage
      .ref()
      .child("images/")
      .listAll()
      .then((res) => {
        res.items.forEach((item) => {
          setData((arr) => [...arr, item.name]);
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  //allows users to delete selected object from the firebase sotrage
  export const handleDelete = (e) => {
    const fileName = e.target.id;
    const result = window.confirm("Would you like to delete " + fileName);
    if (result === true) {
      const imgRef = storage.ref("images/" + fileName);
      deleteObject(imgRef)
        .then(() => {
          alert("File Deleted Successfully");
        })
        .catch((error) => {
          alert("Error Deleteing File");
        });
      window.location.reload();
      return false;
    } else {
      alert("Delete Cancled");
    }
  };

  export const previewImg = (e) => {
    storage
      .ref("images")
      .child(e.target.id)
      .getDownloadURL()
      .then((res) => {
        document.getElementById("uploadedImage").src = res;
      })
      .catch((error) => {
        alert("Error Previewing File");
      });
  };

  export default imageAsUrl;