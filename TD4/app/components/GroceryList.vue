<template>
  <ListView for="item in fItems" @itemTap="onItemTap">
    <v-template>
      <GroceryItem :groceryItem="item"></GroceryItem>
    </v-template>
  </ListView>
</template>

<script >
import GroceryItem from "./GroceryItem";
import Detail from "./Detail";

export default {
  components: { GroceryItem, Detail },
  props: ["items", "filter", "user"],
  methods: {
    onItemTap(args) {
      this.$navigateTo(Detail, {
        props: {
          groceryItem: args.item,
          items: this.items,
          user: this.user
        },
        transition: {
          name: "curlDown",
          duration: 1000,
          curve: "easeIn"
        }
      });
    }
  },
  computed: {
    fItems: function() {
      let fItems = [];
      if (this.filter != -1) {
        this.items.forEach(item => {
          if (this.filter == item.done) fItems.push(item);
        });
      } else fItems = this.items;
      return fItems;
    }
  }
};
</script>

<style>
ListView {
  height: 90%;
  width: 90%;
  margin-top: 5%;
  background-color: white;
  color: black;
  border-width: 3;
  border-color: black;
  border-radius: 20%;
}
</style>