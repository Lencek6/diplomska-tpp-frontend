<template>
    <div id="footer">
        <div id="text">
            <b>Rok Lenček</b> © 2021
        </div>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped>

    #text {
        margin-left: auto;
        padding-right: 1rem;
    }

    #footer {
        display: flex;
        align-items: center;
        padding-left: 200px;
        height: 50px;
        background-color: rgba(167, 167, 167, 0.3);
        width: 100%;
    }

    @media only screen and (max-width: 500px) {

        #footer {
            display: none;
        }

    }


</style>