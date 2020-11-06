import {NV7ElementalAPI} from "./nv7";
import firebase from "firebase/app";
import 'firebase/database';

export async function foundElement(api: NV7ElementalAPI, newElement: string): Promise<void> {
    var found = await new Promise((ret, _) => {
      firebase.database().ref("users/" + api.uid + "/found").once('value').then(function(snapshot) {
        ret(snapshot.val());
      });
    });
    var foundElems = found as string[];
    if (!foundElems.includes(newElement)) {
      foundElems.push(newElement);
      return firebase.database().ref("users/" + api.uid).update({
        found: foundElems,
      }, async function(error) {
        if (error) {
          api.ui.status("Showing Error", 0);
          await api.ui.alert({
          "text": error.message,
          "title": "Error",
          "button": "Ok",
          });
        }
      });
    }
    return null;
}

export async function getFound(api: NV7ElementalAPI): Promise<string[]> {
  var found = await new Promise((ret, _) => {
    firebase.database().ref("users/" + api.uid + "/found").once('value').then(function(snapshot) {
      ret(snapshot.val());
    });
  });
  return found as string[];
}