<template>
  <Page>
    <ActionBar>
      <NavigationButton text="Retour" @tap="back"></NavigationButton>
    </ActionBar>
    <StackLayout>
      <TextField @textChange="save" style="color:black;" v-model="groceryItem.content"></TextField>
      <Button v-if="this.groceryItem.done" class="btnDone" :text="statusText" @tap="toggle"></Button>
      <Button v-else class="btnNotDone" :text="statusText" @tap="toggle"></Button>
      <Button
        v-if="this.groceryItem.done"
        class="btnSupp"
        ios.position="right"
        text="Supprimer"
        @tap="suppItem"
      ></Button>
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios";

const appSettings = require("tns-core-modules/application-settings");
const connexion = require("connectivity");

export default {
  props: ["groceryItem", "items", "user"],
  computed: {
    statusText: function() {
      return this.groceryItem.done ? "Fait" : "A Faire";
    }
  },
  methods: {
    toggle() {
      this.groceryItem.done = !this.groceryItem.done;
      this.save();
    },
    save() {
      if (connexion.getConnectionType() != 0) {
        axios({
          method: "patch",
          url: this.user.links[4].href + "/" + this.groceryItem.uuid,
          headers: { Authorization: `Bearer ${this.user.token}` },
          data: {
            "content": this.groceryItem.content,
            "done": this.groceryItem.done
          }
        }).catch(err => {
          alert(err);
        });
      } else this.groceryItem.not_sync_modif = true;
      appSettings.setString("items", JSON.stringify(this.items));
    },
    suppItem() {
      let obj = this;
      let dialogs = require("tns-core-modules/ui/dialogs");
      let suppr = appSettings.getString("items_sup", []);

      dialogs
        .confirm({
          title: "Attention !",
          message: "Êtes vous sur de vouloir supprimer cette tâche ?",
          okButtonText: "Oui",
          cancelButtonText: "Non"
        })
        .then(function(result) {
          if (result) {
            obj.items.splice(obj.items.indexOf(obj.groceryItem), 1);
            appSettings.setString("items", JSON.stringify(obj.items));

            if (connexion.getConnectionType() != 0) {
              axios({
                method: "delete",
                url: obj.user.links[4].href + "/" + obj.groceryItem.uuid,
                headers: { Authorization: `Bearer ${obj.user.token}` }
              })
                .then(result => {
                  obj.$navigateBack();
                })
                .catch(err => {
                  alert(err);
                });
            } else {
              if (itemsSup.length != 0) itemsSup = JSON.parse(itemsSup);
              itemsSup.push(instance.groceryItem);
              appSettings.setString("items_sup", JSON.stringify(itemsSup));
              obj.$navigateBack();
            }
            obj.$navigateBack();
          }
        });
    },
    back() {
      this.$navigateBack();
    }
  }
};
</script>

<style scoped>
Page {
  background-color: peachpuff;
}
ActionBar {
  background-color: black;
  color: white;
}
.btnNotDone {
  width: 50%;
  color: black;
  background-color: red;
  border-width: 2;
  border-color: black;
  border-radius: 20%;
}
.btnDone {
  width: 50%;
  color: black;
  background-color: green;
  border-width: 2;
  border-color: black;
  border-radius: 20%;
}
.btnSupp {
  width: 50%;
  background-color: red;
  color: white;
  border-width: 2;
  border-color: black;
  border-radius: 20%;
}
StackLayout {
  height: 50%;
  width: 90%;
  background-color: white;
  border-width: 3;
  border-color: black;
  border-radius: 20%;
  margin-top: 5%;
  vertical-align: top;
}
</style>