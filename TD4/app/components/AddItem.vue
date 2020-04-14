<template>
  <Page>
    <StackLayout class="modal">
      <Label text="Ajouter un nouvel item"></Label>
      <TextField v-model="name" hint="Entrer le nom"></TextField>
      <Button text="Sauvegarder" @tap="onSaveTap"></Button>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  data: function() {
    return {
      name: ""
    };
  },
  methods: {
    onSaveTap() {
      const newItem = {
        content: this.name,
        done: false
      };
      this.$modal.close(newItem);
    }
  }
};
</script>

<style scoped>
label {
  text-align: center;
  width: 100%;
}
TextField {
  width: 25%;
}
.white {
  color: white;
}
.modal {
  text-align: center;
  padding: 10px;
}
button {
  border-width: 1;
  border-color: black;
  border-radius: 20%;
  width: 20%;
}
</style>