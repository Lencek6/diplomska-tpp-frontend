<template>
  <div id="navigation">
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
    </ul>
  </div>
</template>

<script>
import links from "@/router/navigation/links";

export default {
  name: "Navigation",
  data() {
    return {
      links: links
    }
  }
}
</script>

<style scoped>

/* Default navbar */

#navigation {
  width: 200px;
  height: 100vh;
  display: flex;
  float: left;
  background-color: var(--nav-bg);
}

ul {
  width: 100%;
  padding-left: 0;
  padding-top: 50px;
  list-style: none;
  display: flex;
  flex-direction: column;
}

li {
  display: flex;
  padding: 0.5rem;
  width: 100%;
}

li:hover {
  background-color: var(--nav-txt-hvr);
}

a:last-child {
  margin-top: auto;
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
  color: red;
}

/* Navbar under 500px */

@media only screen and (max-width: 500px) {

  #navigation {
    float: none;
    height: 50px;
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  ul {
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
  }

}

</style>