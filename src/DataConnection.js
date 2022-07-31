import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  child,
  get,
  query,
  orderByChild,
  equalTo,
  update
} from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8B9JhNr-idYFH5rXLZnsyagzVsEdwem0",
  authDomain: "golden-shoe-303e8.firebaseapp.com",
  databaseURL:
    "https://golden-shoe-303e8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "golden-shoe-303e8",
  storageBucket: "golden-shoe-303e8.appspot.com",
  messagingSenderId: "106849259056",
  appId: "1:106849259056:web:b3c380757f8f10299ee7f5"
};

const firebaseApp = initializeApp(firebaseConfig);

export async function getProducts() {
  const dbRef = ref(getDatabase());
  var data = [];
  await get(child(dbRef, "products"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((snap) => {
          data.push(snap.val());
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return data;
}

export async function getOrders() {
  const dbRef = child(ref(getDatabase()), "orders");
  var data = [];
  const user = getAuth().currentUser?.uid ?? "";
  const userQuery = query(dbRef, orderByChild("user"), equalTo(user));
  await get(userQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((snap) => {
          data.push(snap.val());
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return data;
}

export async function sendReturn(id) {
  const db = getDatabase();

  const updates = {};
  updates["/orders/" + id + "/orderState"] = "Return in Progress";
  return update(ref(db), updates);
}

export { firebaseApp };
