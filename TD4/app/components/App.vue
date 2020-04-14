<template>
  <Page>
    <ActionBar title="My TodoList">
      <ActionItem ios.systemIcon="4" text="Ajouter" @tap="onAddTap"></ActionItem>
      <ActionItem text="Filtrer" @tap="onOpenTap"></ActionItem>
    </ActionBar>
    <StackLayout>
      <GroceryList :items="items" :filter="filter" :user="user" />
    </StackLayout>
  </Page>
</template>

<script >
import GroceryList from "./GroceryList";
import AddItem from "./AddItem";
import Filter from "./Filter";
import Connexion from "./Connexion";

import axios from "axios";

const appSettings = require("tns-core-modules/application-settings");
const connexion = require("connectivity");

export default {
  components: { GroceryList, AddItem, Filter },
  data() {
    return {
      items: [],
      user: null,
      filter: -1
    };
  },
  methods: {
    onAddTap() {
      this.$showModal(AddItem).then(newItem => {
        if (newItem) {
          if (connexion.getConnectionType() != 0) {
            axios({
              method: "post",
              url: this.user.links[4].href,
              headers: { Authorization: `Bearer ${this.user.token}` },
              data: {
                content: newItem.content
              }
            })
              .then(result => {
                newItem.uuid = result.data.todo.uuid;
                this.items.unshift(newItem);
              })
              .catch(err => {
                alert(err);
              });
          } else {
            newItem.not_sync_add = true;
            this.items.unshift(newItem);
          }
          appSettings.setString("items", JSON.stringify(this.items));
        }
      });
    },
    onOpenTap() {
      this.$showModal(Filter).then(filter => {
        this.filter = -1;
        if (filter === 1) this.filter = 0;
        else if (filter === 2) this.filter = 1;
      });
    }
  },
  created() {
    if (connexion.getConnectionType() == 0) {
      let items = appSettings.getString("items", []);
      if (items.length != 0) this.items = JSON.parse(items);
      alert(
        "Problème de connexion, la synchronisation se fera lorsque vous aurez internet."
      );
    } else {
      let user = appSettings.getString("user", false);

      if (user) {
        user = JSON.parse(user);
        axios({
          method: "post",
          url: "https://api.todolist.sherpa.one/users/check-token",
          headers: { Authorization: `Bearer ${user.token}` }
        })
          .then(result => {
            this.user = user;
            let items = appSettings.getString("items", []);
            if (items.length != 0) {
              items = JSON.parse(items);

              items.forEach(i => {
                if (i["not_sync_add"]) {
                  alert(
                    "Synchronisation de vos tâches ajoutées hors connexion."
                  );
                  axios({
                    method: "post",
                    url: user.links[4].href,
                    headers: { Authorization: `Bearer ${user.token}` },
                    data: {
                      content: i.content
                    }
                  })
                    .then(result => {
                      if (i["not_sync_modif"]) {
                        axios({
                          method: "patch",
                          url:
                            user.links[4].href + "/" + result.data.todos.uuid,
                          headers: { Authorization: `Bearer ${user.token}` },
                          data: {
                            done: i.done
                          }
                        }).catch(err => {
                          alert(err);
                        });
                      }
                    })
                    .catch(err => {
                      alert(err);
                    });
                } else if (i["not_sync_modif"]) {
                  alert(
                    "Synchronisation de vos tâches modifées hors connexion."
                  );
                  axios({
                    method: "patch",
                    url: user.links[4].href + "/" + i.uuid,
                    headers: { Authorization: `Bearer ${user.token}` },
                    data: {
                      content: i.content,
                      done: i.done
                    }
                  }).catch(err => {
                    alert(err);
                  });
                }
              });
            }
            let suppr = appSettings.getString("items_sup", []);
            if (suppr.length != 0) {
              alert("Synchronisation de vos tâches supprimées hors connexion.");
              suppr = JSON.parse(suppr);

              suppr.forEach(sup => {
                axios({
                  method: "delete",
                  url: user.links[4].href + "/" + sup.uuid,
                  headers: { Authorization: `Bearer ${user.token}` }
                }).catch(err => {
                  alert(err);
                });
              });
            }

            appSettings.remove("items_sup");

            axios({
              method: "get",
              url: user.links[4].href,
              headers: { Authorization: `Bearer ${user.token}` }
            })
              .then(result => {
                if (result.data.todos.length != 0)
                  this.items = result.data.todos.reverse();
                else this.items = [];
                appSettings.setString("items", JSON.stringify(this.items));
              })
              .catch(err => {
                alert(err);
              });
          })
          .catch(err => {
            this.$navigateTo(Connexion);
            this.alert("Vous avez été déconnecté, veuillez vous reconnecter");
          });
      } else {
        this.$navigateTo(Connexion);
        this.alert("Vous avez été déconnecté, veuillez vous reconnecter");
      }
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
.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
