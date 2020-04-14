<template>
    <GridLayout columns="200, *">
        <Label class="states" col="0" :text="statusText"></Label>
        <Label col="1" :class="{ 'line-through' : groceryItem.done}" class="item-name" :text="groceryItem.content"></Label>
    </GridLayout>
</template>

<script>
export default {
    props: ['groceryItem'],
    computed: {
        statusText: function() {
            return this.groceryItem.done ? 'Fait' : 'A Faire';
        }
    },
};
</script>

<style>

GridLayout {
    border : 1px solid black;
}

label {
    font-size: 16;

}
    .line-through {
        text-decoration: line-through;
    }
    .item-name{
        animation-name: show;
        animation-duration: 4s;
        animation-fill-mode: forwards;
        text-align: center;
        color:black;
    }

    @keyframes show {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
        
    }
</style>