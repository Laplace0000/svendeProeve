import './assets/main.css';
import { createApp } from 'vue';
import { reactive } from 'vue';
import { provide } from 'vue';
import * as dataHandler from './dataHandler';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FileUpload from 'primevue/fileupload';
import Toolbar from 'primevue/toolbar';
import Checkbox from 'primevue/checkbox';
import MultiSelect from 'primevue/multiselect';
import CascadeSelect from 'primevue/cascadeselect';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';
import Aura from '@primevue/themes/aura';                   
import InputText from 'primevue/inputtext';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast'; // Import the Toast component
import DialogService from 'primevue/dialogservice'
import Chart from 'primevue/chart';


const app = createApp(App);
//app.use(PrimeVue, { unstyled: true });
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

//Fetcing json data for all components and views 
(async () => {
    const dataSources = [
        //dataHandler.fetch0('./data/eudemos_new.json'),
        //dataHandler.fetch0('./data/user2ndhalf.json'),
        dataHandler.fetch0('./data/euds.json'),
    ];

    const results = await Promise.allSettled(dataSources);

    const fetchedData = results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            console.error(`Failed to fetch data source ${index}:`, result.reason);
            return null; 
        }
    });

    const eudemosData = reactive({
        eudemosData: fetchedData[0] || []
    });

    const globalIDsHash = {};
    const idList = [];

    // Populate idList and hashmap
    fetchedData.forEach(data => {
        if (data && Array.isArray(data)) {
            const ids = data.map(obj => obj.id); // Extract ids
            idList.push(...ids);
            ids.forEach(id => { globalIDsHash[id] = true; }); // Add to hashmap
        }
    });

    app.provide('eudemosData', eudemosData);
    app.provide('globalIDsHash', globalIDsHash);

    app.mount('#app');
})();



// Register components
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('FileUpload', FileUpload);
app.component('Toolbar', Toolbar);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('InputText', InputText);
app.component('Toast', Toast);
app.component('MultiSelect', MultiSelect)
app.component('Checkbox', Checkbox)
app.component('CascadeSelect', CascadeSelect)
app.component('Chart', Chart)



