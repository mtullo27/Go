import React, { useState } from "react";
import { signInWithGoogle, logOut} from './firebaseConfig';
import Button from "@mui/material/Button";
import { storage } from "./firebase/firebase";
import { deleteObject } from "firebase/storage";

import './App.css';

function App() {

  const allInputs = { imgUrl: "" };
  const [data, setData] = useState([]);
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  function onShowAlert(type) {
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

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
    const [file] = e.target.files;
    if (file) {
      document.getElementById("uploadedImage").src = URL.createObjectURL(file);
    }
  };

  const handleFireBaseUpload = (e) => {
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

  function clearBox(elementID) {
    var div = document.getElementById(elementID);
      
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
  }

  const listItems = () => {
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

  const handleDelete = (e) => {
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

  const previewImg = (e) => {
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

  return (
    <div className="App">
      <header className="App-header">
        <label id="userEmail">Please Sign On</label>
        <Button onClick = {signInWithGoogle} id="signOnButton">Sign In</Button>
        <Button onClick = {logOut} id = "logOutButton">Log Out</Button>
      </header>
    </div>
  );
}

export default App;