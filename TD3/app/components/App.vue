<template>
  <Page>
    <ActionBar title="My TodoList">
      <ActionItem ios.systemIcon="4" text="Ajouter" @tap="onAddTap"></ActionItem>
      <ActionItem text="Filtrer" @tap="onOpenTap"></ActionItem>
    </ActionBar>
    <StackLayout>
      <GroceryList :items="items" :filter="filter" />
    </StackLayout>
  </Page>
</template>

<script >
import GroceryList from "./GroceryList";
import AddItem from "./AddItem";
import Filter from "./Filter";

const appSettings = require("tns-core-modules/application-settings");

export default {
  components: { GroceryList, AddItem, Filter },
  data() {
    return {
      items: [],
      filter: -1
    };
  },
  methods: {
    onAddTap() {
      const newId = new Date().getTime();
      this.$showModal(AddItem, { props: { id: newId } }).then(newItem => {
        if (newItem) {
          let appSet = appSettings.getString("items", []);
          if (appSet.length != 0) this.items = JSON.parse(appSet);
          this.items.unshift(newItem);
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
    let appSet = appSettings.getString("items", []);
    if (appSet.length != 0) this.items = JSON.parse(appSet);
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
