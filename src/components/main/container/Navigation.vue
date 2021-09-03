<template>
  <div id="navigation">
    <div id="navigation-logo">
      <img class="tpp-logo" :src="tppLogo"/>
      Simulator TPP
    </div>
    <ul>
      <router-link v-for="link in links" :key="link.name" :to="link.route">
        <li>
          <div class="icon">
            <b-icon :icon="link.icon"></b-icon>
          </div>
          <div class="name">
            {{ link.name }}
          </div>
        </li>
      </router-link>
      <a class="logout" @click="logout">
      <li>
        <div class="icon">
          <b-icon icon="box-arrow-right"></b-icon>
        </div>
        <div class="name">
          Odjava uporabnika
        </div>
      </li>
      </a>
    </ul>
  </div>
</template>

<script>
import links from "@/router/navigation/links";
import utilities from "../../../utils/utilities";

export default {
  name: "Navigation",
  data() {
    return {
      links: links,
      tppLogo: require('/public/1989138.svg')
    }
  },
  methods: {
    logout() {
      utilities.logout();
    }
  }
}
</script>

<style scoped>

  #navigation-logo {
    text-align: left;
    background-color: rgba(44, 62, 80, 0.5);
    color: black;
  }

  .tpp-logo {
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 4px;
    height: 50px;
  }

  .logout:hover {
    cursor: pointer;
  }

/* Default navbar */

#navigation {
  width: 200px;
  height: 100%;
  position: fixed;
  background-color: var(--nav-bg);
}

ul {
  width: 100%;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}

li {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  width: 100%;
  height: 50px;
}

li:hover {
  background-color: var(--nav-txt-hvr);
}

a:last-child {
  position: fixed;
  bottom: 0;
  width: 200px;
}

.name {
  padding-left: 0.6rem;
}

.icon {
  padding-left: 0.5rem;
}

a {
  text-decoration: none;
  color: var(--nav-txt);
}

a:hover {
  color: var(--nav-txt);
}

.router-link-exact-active {
  color: #0d6efd;
}

/* Navbar under 500px */

@media only screen and (max-width: 500px) {

  #navigation-logo {
    display: none;
  }

  #navigation {
    height: 50px;
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 2;
  }

  ul {
    height: 50px;
    overflow-x: auto;
    margin-bottom: 0;
    padding-left: 0;
    padding-top: 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  li {
    height: 100%;
    display: inline-flex;
    align-items: center;
    min-width: 50px;
    justify-content: center;
  }

  .icon {
    padding: 0;
  }

  .name {
    display: none;
  }

  a:last-child {
    margin-top: 0;
    position: initial;
    width: auto;
  }



}

</style>