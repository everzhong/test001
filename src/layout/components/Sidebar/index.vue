<template>
    <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg"
                :text-color="settings.sideTheme === 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'"
                :unique-opened="true"
                active-text-color="#fff"
                :collapse-transition="false"
                mode="vertical"
                @open="memueOpen"
                @close="memueOpen"
                @select="menueSelect"
              >
                <sidebar-item
                    v-for="(route, index) in sidebarRouters"
                    :key="route.path  + index"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";
export default {
    components: { SidebarItem, Logo },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["sidebarRouters", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    },
    methods:{
      memueOpen( index ){
        if(index==='/checkup/jcss/jcss' && this.$route.fullPath!=='/checkup/jcss/jianchass'){
          this.$router.push('/checkup/jcss/jianchass')
          const jcss =  document.getElementById('jcss')
          if(jcss.length>0){
            const target =  jcss.getElementsByClassName('el-submenu__title')[0]
            target.className = 'new__title'
          }
        }
      },
      menueSelect(index){
        if(!index.indexOf('jcss')>-1){
          const jianchass = document.getElementById('jcss')
          const target = (jianchass && jianchass.length>0)?(jianchass.getElementsByClassName('new__title')):[]
          if(target.length>0){
            target[0].className = "el-submenu__title"
          }
        }
      }
    }
};
</script>