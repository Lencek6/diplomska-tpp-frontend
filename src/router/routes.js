import Login from "@/components/main/Login";
import NotFound from "@/components/main/NotFound";
import Container from "@/components/main/Container";
import Dashboard from "@/components/views/Dashboard";
import Ais from "@/components/views/Ais";
import Pis from "@/components/views/Pis";
import Settings from "@/components/views/Settings";

const routes = [
    {
        path: '/login',
        component: Login,
        name: 'Prijava',
        meta:{
            auth: false
        }
    },
    {
        path: '/not-found',
        component: NotFound,
        name: 'Stran ne obstaja',
        meta:{
            auth: true
        }
    },
    {
        path: '/',
        redirect: '/dashboard',
        component: Container,
        name: '',
        meta:{
            auth: true
        },
        children: [
            {
                path: '/dashboard',
                component: Dashboard,
                name: 'Nadzorna plošča',
            },
            {
                path: '/ais',
                component: Ais,
                name: 'AIS',
            },
            {
                path: '/pis',
                component: Pis,
                name: 'PIS',
            },
            {
                path: '/settings',
                component: Settings,
                name: 'Nastavitve',
            }
        ]
    },

];

export default routes;