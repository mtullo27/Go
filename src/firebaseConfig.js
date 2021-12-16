import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import axios from "axios";
import config from './firebaseDetails'


firebase.initializeApp(config);

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });


//custom sign in method using google sign in provider 
export const signInWithGoogle = async (e) => {
  try {
    await auth.signInWithPopup(provider).then((props) => {
      const session = window.localStorage;
      session.setItem('userID', props.user.uid)
      firebase.auth().currentUser.getIdToken(true).then(function (token){
        document.cookie = '__session=' + props.user.uid + ';max-age=3600';
      }).catch((err) => {
        console.log(err);
      })
      getGIDUser(props.user.uid)
        .then((response) => {
          //create a new user if the do not exist in the user table
          if (response.data.length === 0) {
            const userEmail = props.user.email;
            const uid = props.user.uid
            //get asscoiateOID based on buisness email
            getAssociateID(userEmail)
              .then((response) => {
                //creating new user
                const aOID = response.data[0].AssociateOID;
                const newUser = {
                  AssociateOID: aOID,
                  GoogleID: uid,
                };
                //post new user
                createUser(newUser)
                  .then((response) => console.log(response))
                  .catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          }
          const assOID = response.data[0].AssociateOID;
          //get assigned apps based on AssociateOID
          getApps(assOID)
            .then((response) => console.log(response.data))
            .catch((error) => console.log(error));
          //get authorizations based on AssociateOID
          getAuthorization(assOID)
            .then((response) => console.log(response.data))
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    });
  } catch (err) {
    alert(err.message);
  }
};

//post method to create a new user in backend
export const createUser = async (newUser) => {
  await axios.post("http://localhost:5000/user", newUser);
};

//get method to get googleID from backend
export const getGIDUser = async (uID) => {
  const res = await axios.get(`http://localhost:5000/user/google/${uID}`);
  return res;
};

//get method to get AssociabteOID from backend
export const getUser = async (AssociateOID) => {
  const res = await axios.get(`http://localhost:5000/user/${AssociateOID}`);
  return res;
};

//get method to get authorizations from backend
export const getAuthorization = async (AssociateOID) => {
  const res = await axios.get(
    `http://localhost:5000/authorization/user/${AssociateOID}`
  );
  return res;
};

//post method to create new authorizations in backend
export const createPermissions = async (AssociateOID, APPID, PermID) => {
  if (auth.user !== null) {
    const newPermission = {
      AssociateOID: AssociateOID,
      ApplicationID: APPID,
      PermissionID: PermID,
    };
    const res = axios.post(
      `http://localhost:5000/authorization/${newPermission}`
    );
    return res;
  }
};

//get method to get assigned apps from backend
export const getApps = async (AssociateOID) => {
  const res = await axios.get(
    `http://localhost:5000/authentication/user/${AssociateOID}`
  );
  return res;
};

//delete method to delete user from backend
export const deleteUser = async (AssociateOID) => {
  const res = await axios.delete(`http://localhost:5000/user/${AssociateOID}`);
  return res;
};

//get method to get AssociateOID from sql backend using email
export const getAssociateID = async (BuisnessEmail) => {
  const res = await axios.get(`http://localhost:5000/sql/${BuisnessEmail}`);
  return res;
};

//signs user out of google
export const logOut = () => {
  auth.signOut();
  console.clear();
  document.getElementById("userEmail").innerHTML = "Please Sign On";
};

export const giveAuthorization = async (ApplicationObj) =>{
  const res = await axios.post(`http://localhost:5000/Authorization/${ApplicationObj}`);
  return res;
}

//get app id based on app name
export const getAppByName = async (Application) => {
  const res = await axios.get(`http://localhost:5000/sql/${Application}`);
  return res;
}

export const createCookie = async (value) =>{
}

export default firebase;
