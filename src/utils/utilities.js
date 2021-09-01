import router from "../router/index";
import notification from "./notification";

export default  {

    logout() {
      localStorage.clear();
        router.push('/login');
    },

    handleError(error) {
        if(!error) return
        if(typeof (error) !== 'string') return
        if(error.toLowerCase().includes('token') || error.toLowerCase().includes('right permission')) return this.logout();
        notification.show('Odgovor strežnika', error, 'danger');
    }

}