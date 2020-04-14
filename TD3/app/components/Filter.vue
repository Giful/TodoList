<template>
    <Page>
        <StackLayout>
            <ListPicker :items=items v-model="filter"></ListPicker>
            <Button text="Valider" @tap="onSaveTap"></Button>
        </StackLayout>
    </Page>
</template>

<script>
export default {
    props: ['id'],
    data: function () {
        return {
            items: 
            ["Tout afficher",
            "Tâches réalisées",
             "Tâches à faire", 
             ],
             filter : 0
        };
    },
    methods: {
        onSaveTap() {
            this.$modal.close(this.filter);
        }
    }
};
</script>
