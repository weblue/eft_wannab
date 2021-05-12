<template>
    <div>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" :style="`
                        width:${w}px;
                        height:${h}px;
                        background-image: url(images/items/${item.img});
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: cover;`"></div>
            </template>
            <span style="text-decoration: underline">{{ item.name }}</span>
            <!-- TODO display count if non-zero -->
            <!-- <p class="mb-0">{{ sub_item.count }}</p> -->
        </v-tooltip>
    </div>
</template>

<script>
export default {
    name: "ItemCard",
    props: ["item", "count"],
    created() {
        if (this.item) {
            var img = new Image();
            img.onload = () => {
                /*console.log(
                    "image %s has width: %s and height: %s",
                    img.src,
                    img.width,
                    img.height
                );*/

                this.w = img.width;
                this.h = img.height;
            };
            img.src = "images/items/" + this.item.img;

            //Confirm existence of images
            //TODO make this debug only
            const http = new XMLHttpRequest();
            http.open("HEAD", "images/items/" + this.item.img);
            http.send();
            http.onreadystatechange = e => {
                if (http.status == 404)
                    console.log(
                        "Missing image for item: %s, file name: %s",
                        this.item.name,
                        this.item.img
                    );
            };
        } else {
            console.log("attempt to create card without item");
        }
    },
    methods: {},
    data() {
        return {
            w: 50,
            h: 50
        };
    }
};
</script>