<template>
    <b-card>
        <div slot="header" v-html="caption"></div>
        <!-- Custom elements per page dropdown default value = 10 -->
        <div class="mb-3">
            <b-dropdown size="md" text="Elementi/stran" variant="custom-buttons">
                <b-dropdown-item v-for="(pages, index) in perPageOpt" :key="index" @click.native="applyPerPage(pages.value)">
                    {{pages.value}}
                </b-dropdown-item>
            </b-dropdown>
            <!-- Clear search button -->
            <b-button class="float-end" variant="custom-buttons" @click="clearSearches">Resetiraj iskalnik</b-button>
        </div>
        <slot name="additional-info"></slot>
        <b-table ref="bTable" :dark="dark" :hover="hover" :striped="striped" :bordered="bordered" :small="small" v-if="!loader"
                 :items="items" :fields="captions" :current-page="currentPage" :per-page="perPage"
                 @row-clicked="rowClicked" :tbody-tr-class="rowClass" responsive :sticky-header="sticky">

            <!-- Dynamically add statuses in row. If they are passed in from parent component -->
            <template v-if="status.length" v-slot:cell(status)="data">
                <div class="status-div">
                    <b-badge class="status-div-badge" :variant="getBadge(status[0], data.item)">{{status[0][data.item[status[0].indicator]].customName}}
                    </b-badge>
                </div>
            </template>

            <!-- Dynamically add custom buttons in row. Elements are passed in from parent component -->
            <template v-if="htmlField.length" v-slot:cell(htmlField)="data">
                <div class="action-div">
                    <!-- Details -->
                    <b-button v-if="htmlField[0].details" :variant="htmlField[0].detailsVariant || 'custom-buttons'" size="sm" @click="data.toggleDetails" class="action-button details-button">
                        <b>{{ data.detailsShowing ? 'Skrij' : 'Prikaži'}} podrobnosti</b>
                    </b-button>
                    <!-- Custom -->
                    <div v-if="htmlField[0].actions">
                        <b-button class="action-button" v-for="(element,index) in htmlField[0].actions" :key="index" size="sm"
                                  @click="emit(index, data.item)"
                                  :variant="element.variant" style="border: black"><i
                                :class="element.icon"></i><b>{{element.text}}</b></b-button>
                    </div>
                </div>
            </template>

            <!-- Dynamically add details -->
            <template #row-details="row" v-if="htmlField.length && htmlField[0].details">
                <b-card class="details">
                    <b-row class="details-row" v-for="det in htmlField[0].details" :key="det.key">
                        <b-col sm="1" class="text-sm-left"><b>{{det.label}}</b></b-col>
                        <b-col class="text-sm-left">{{ row.item[det.key]}}</b-col>
                    </b-row>
                </b-card>
            </template>

            <!-- Dynamically add search fields. Fields are added from parent component -->
            <template v-slot:thead-top="">
                <tr>
                    <th v-for="(field, index) in fields" :key="index"
                        :class="(field.search) ? 'border-bottom-0 custom-search-hdr' : 'border-0 custom-search-hdr'">
                        <!-- Each input group has input field -->
                        <b-input-group v-if="field.search">
                            <b-form-input type="text" :state="null" :placeholder="getSearchPlaceholder(field.label)"
                                          style="min-width: 80px"
                                          v-model="search[field.key]" @input="searchTable"></b-form-input>
                        </b-input-group>
                    </th>
                </tr>
            </template>
        </b-table>
        <div v-else class="loader">
            <b-spinner class="mr-2" small variant="custom-buttons" label="Spinning"></b-spinner>
            <span>Pridobivanje podatkov...</span>
        </div>
        <div class="d-inline-flex flex-column flex-sm-row justify-content-sm-between custom-footer-div">
            <nav>
                <!-- Table pagination -->
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="Nazaj"
                              next-text="Naprej"
                              hide-goto-end-buttons/>
            </nav>
            <div>
                <slot name="actbtn"></slot>
            </div>
            <!-- Custom actions -->
            <div class=" ex-dl">
                <!-- Manager slot -->
                <span class="mr-3 custom-excel-button"><slot name="manager"></slot></span>
                <!-- Excel download -->
                <b-icon icon="file-earmark-medical-fill" class="custom-excel-button"  v-on:click="onExport" v-if="!disableExport"></b-icon>
            </div>
        </div>
    </b-card>
</template>

<script>
    import XLSX from 'xlsx'

    export default {
        name: 'Table',
        inheritAttrs: false,
        props: {
            disableExport: {
                type: Boolean,
                default: false
            },
            sticky: {
                type: Boolean,
                default: false
            },
            caption: {
                type: String,
                default: 'Table'
            },
            hover: {
                type: Boolean,
                default: true
            },
            striped: {
                type: Boolean,
                default: false
            },
            bordered: {
                type: Boolean,
                default: false
            },
            small: {
                type: Boolean,
                default: false
            },
            loader: {
                type: Boolean,
                default: false
            },
            fixed: {
                type: Boolean,
                default: false
            },
            tableData: {
                type: [Array, Function],
                default: () => []
            },
            fields: {
                type: [Array, Object],
                default: () => []
            },
            status: {
                type: [Array, Object],
                default: () => []
            },
            htmlField: {
                type: [Array, Object],
                default: () => []
            },
            details: {
                type: [Array, Object],
                default: () => []
            },
            dark: {
                type: Boolean,
                default: false
            },
            rowClassIndicator: {
                type: String,
                default: ''
            },
            prepend: {
                type: Boolean,
                default: true
            },
            selectableCustom: {
                type: Boolean,
                default: false
            }
        },
        data: () => {
            return {
                perPage: 10,
                currentPage: 1,
                search: [],
                tableItems: [],
                perPageOpt: [
                    {id: 1, value: 5},
                    {id: 2, value: 10},
                    {id: 3, value: 20},
                    {id: 4, value: 50},
                    {id: 5, value: 100},
                ]
            }
        },
        computed: {
            items: function () {
                const items = this.tableItems;
                return Array.isArray(items) ? items : items()
            },
            totalRows: function () {
                return this.getRowCount()
            },
            captions: function () {
                return this.fields.concat(this.status).concat(this.htmlField);
            }
        },
        methods: {
            // On Excel download icon click
            onExport() {
                //Creating an object for checking if key and labale are the same
                let objLab = {};
                this.fields.forEach(el => objLab[el.key] = [el.key, el.label]);
                // Include only relevant items
                let tableItemsWithExcluded = this.tableItems.map((el) => {
                    let obj = {...el};
                    Object.keys(el).forEach((key) => {
                        //Delete extra fields  that are not in this.fields
                        if (!this.fields.map((el) => el.key).includes(key)) return delete obj[key];
                        //Rename the fileds by it's label
                        if(objLab[key][0] === objLab[key][1]) {
                            delete Object.assign(obj, {['tmp']: obj[key]})[key];
                            return delete Object.assign(obj, {[objLab[key][1]]: obj['tmp']})['tmp'];
                        }
                        return delete Object.assign(obj, {[objLab[key][1]]: obj[key]})[key];
                    });
                    return obj;
                });

                // Export json to Worksheet of Excel
                let data = XLSX.utils.json_to_sheet(tableItemsWithExcluded);
                // Format columns width
                let result = [];
                if (tableItemsWithExcluded.length) {
                    Object.keys(tableItemsWithExcluded[0]).forEach(el => { // Initial wch (width in string len) is attributes name len
                        result.push({wch: el.length});
                    });
                    // Go trough every element and set new len if its larger
                    tableItemsWithExcluded.forEach(el => {
                        Object.keys(el).forEach((key, index) => {
                            if (el[key] && result[index].wch < el[key].toString().trim().length) {
                                result[index].wch = el[key].toString().trim().length;
                            }
                        })
                    });
                }
                // Set worksheet column lengths
                data['!cols'] = result;
                // Make Workbook of Excel
                let wb = XLSX.utils.book_new();
                // Add Worksheet to Workbook - Workbook can contain one or more worksheet
                XLSX.utils.book_append_sheet(wb, data, 'PSD2-tpp'); // sheetAName is name of Worksheet
                // Export Excel file
                XLSX.writeFile(wb, 'PSD2_TPP.xlsx'); // name of the file is 'VersaOnline.xlsx'
            },
            // Generate and return placeholder for search field
            getSearchPlaceholder: function (key) {
                return '🔍 ' + key
            },
            // get badges color, based on definitions passed from parent component
            getBadge(status, item) {
                return status[item[status.indicator]].color
            },
            // Emits custom button's event back to a parent
            emit(index, item) {
                this.$emit(this.htmlField[0].actions[index].event, item)
            },
            onRowSelected(items) {
                if(this.tmpPage == this.currentPage) {
                    this.$emit('row-select', items);
                }
                this.tmpPage = this.currentPage;
            },
            clearRows() {
                this.$refs.bTable.clearSelected();
            },
            // Method for colorizing row based on rowClassIndicator attribute which is specified by the parent component. It contains the name of the field containing the color information
            rowClass(item) {
                if (!item) return
                if (item[this.rowClassIndicator]) return 'bg-' + item[this.rowClassIndicator]
                if(this.selectableCustom == true) {
                    if(item.selected){
                        return ["b-table-row-selected", "table-custom-buttons", "cursor-pointer"]
                    } else {
                        return ["cursor-pointer"]
                    }
                }
            },
            // Called on clear search button click. Clears all search queries and resets table state
            clearSearches: function () {
                this.search = {};
                this.tableItems = this.tableData
            },
            // On clicked elements/page dropdown: apply changes
            applyPerPage: function (value) {
                this.perPage = value;
                localStorage.setItem('ep_table_' + this.$route.path, value);
            },
            getRowCount: function () {
                return this.items.length
            },
            // Pass data about row clicked to a parent component
            rowClicked(item) {
                this.$emit('row-clicked', item)
            },
            // Search table
            searchTable: function () {
                this.tableItems = this.tableData;
                Object.keys(this.search).forEach(searchVal => {
                    if (this.search[searchVal] && this.search[searchVal] !== "") {
                        this.tableItems = this.tableItems.filter(el => {
                            if(el[searchVal]) return el[searchVal].toString().toLocaleLowerCase().includes(this.search[searchVal].toLowerCase());
                        })
                    }
                });
            }
        },
        // Update child table data when props changes are made from a parent
        watch: {
            tableData: function () {
                this.tableItems = this.tableData;
                // Apply search filters
                this.searchTable();

            }
        },
        // Fill child table data with props passed from a parent
        mounted() {
            this.tableItems = this.tableData;
            if (localStorage.getItem('ep_table_' + this.$route.path)) {
                this.perPage = localStorage.getItem('ep_table_' + this.$route.path);
            }
        }
    }
</script>

<style>

    tr {
        white-space: nowrap;
    }

    .cursor-pointer {
        cursor: pointer !important;
    }

</style>

<style scoped>

    .details-row:not(:last-child){
        border-bottom: solid #c8ced3 1px;
    }

    .details-row{
        padding: 0.5rem;
    }

    .details-button {
        width: 132px;
    }

    .details {
        white-space: pre-line;
    }

    .status-div-badge {
        width: 100%;
        text-transform: uppercase;
    }

    .status-div {
        text-align: center;
    }

    .action-div {
        display: flex;
        justify-content: center;
    }

    .action-button {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }

    /* Table overflow fix */
    div >>> table {
        width: calc(100% - 1px);
    }

    .loader {
        font-size: 16px;
        font-weight: 500;
        color: #20a8d8;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .custom-search-hdr {
        position: relative !important;
    }

    div >>> th:focus {
        outline: none !important;
    }

    div >>> tr:focus {
        outline: none !important;
    }

    div >>> tr:hover {
        cursor: default;
    }

    input[type="text"], textarea, .customButton {
        outline: none;
        box-shadow: none !important;
        border: 1px solid #ccc !important;
    }

    input {
        color: rgba(32, 168, 216, 0.62) !important;
    }

    .customButton:hover {
        background: #20a8d8 !important;
    }

    .custom-footer-div {
        width: 100%;
    }

    .custom-excel-button {
        font-size: 20px;
        color: rgba(13, 110, 253, 0.59);
        cursor: pointer;
    }

    .ex-dl {
        padding-right: 0px;
    }

</style>
