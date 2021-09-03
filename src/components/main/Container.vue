<template>
    <div id="container-footer-wrapper">
        <div id="container">
            <!-- Header, Footer, Navigation and views -->
            <Header></Header>
            <Navigation></Navigation>
            <!-- Views -->
            <div id="main">
                <router-view></router-view>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import Navigation from "@/components/main/container/Navigation";
    import Header from "@/components/main/container/Header";
    import Footer from "./container/Footer";

    export default {
        name: "Container",
        components: {Footer, Header, Navigation}
    }
</script>

<style scoped>

    #container {
        min-height: calc(100vh - 50px);
    }

    >>> .card-header {
        background-color: var(--nav-txt-hvr);
    }

    #main {
        display: flex;
        margin-left: 200px;
        padding-top: 50px;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 1rem;
    }

    /* Main view under 500px */

    @media only screen and (max-width: 500px) {

        #main {
            display: flex;
            margin-left: 0;
            padding-top: 50px;
            padding-bottom: calc(50px + 1rem);
            padding-left: 1rem;
            padding-right: 1rem;
        }

    }

</style>